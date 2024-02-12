use std::ffi::c_void;
use std::io::{BufRead, BufReader, Read, Write};
use std::str;
use std::{env, slice};

use futures::{SinkExt, StreamExt};
use futures_util::TryFutureExt;
use mt_logger::*;
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use serde::Deserialize;
use serde_json::{json, Value};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::Mutex;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;

const PTY_SERVER_ADDRESS: &str = "127.0.0.1:7703";
const TERM: &str = "xterm-256color";

const fn c(bytes: &[u8]) -> &core::ffi::CStr {
    unsafe { core::ffi::CStr::from_bytes_with_nul_unchecked(bytes) }
}

#[derive(Deserialize, Debug)]
struct WindowSize {
    pub rows: u16,
    pub cols: u16,
}

async fn handle_client(stream: TcpStream) {
    let ws_stream = accept_async(stream).await.expect("Failed to accept");
    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    let pty_system = native_pty_system();
    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .unwrap();

    let cmd = if cfg!(target_os = "windows") {
        let mut cmd = CommandBuilder::new(r"cmd");

        cmd.env("PROMPT", "$P$G ");

        cmd
    } else {
        let username = env::var("USER").unwrap();

        let mut cmd = CommandBuilder::new("login");
        cmd.args(["-fp", username.as_str()]);
        cmd.env("TERM", TERM);
        cmd.env("LANG", "en_US.UTF-8");
        cmd.env("LC_ALL", "en_US.UTF-8");
        cmd
    };

    let mut pty_child_process = pty_pair.slave.spawn_command(cmd).unwrap();

    let mut pty_reader = pty_pair.master.try_clone_reader().unwrap();
    let mut pty_writer = pty_pair.master.take_writer().unwrap();

    std::thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();

        rt.block_on(async {
            loop {
                let mut temp_buffer = [0; 2048];
                let size = pty_reader.read(&mut temp_buffer).unwrap_or(0);
                let output = String::from_utf8_lossy(&temp_buffer[..size]).to_string();

                ws_sender
                    .send(Message::Text(output))
                    .await
                    .expect("Failed to send message over WebSocket");
            }
        })
    });

    while let Some(message) = ws_receiver.next().await {
        let message = message.unwrap();
        match message {
            Message::Binary(msg) => {
                let msg_bytes = msg.as_slice();
                match msg_bytes[0] {
                    0 => {
                        if msg_bytes.len().gt(&0) {
                            pty_writer.write_all(&msg_bytes[1..]).unwrap();
                        }
                    }
                    1 => {
                        let resize_msg: WindowSize =
                            serde_json::from_slice(&msg_bytes[1..]).unwrap();
                        let pty_size = PtySize {
                            rows: resize_msg.rows,
                            cols: resize_msg.cols,
                            pixel_width: 0,
                            pixel_height: 0,
                        };
                        pty_pair.master.resize(pty_size).unwrap();
                    }
                    _ => mt_log!(Level::Error, "Unknown command {}", msg_bytes[0]),
                }
            }
            Message::Close(_) => {
                mt_log!(Level::Info, "Closing the websocket connection...");

                mt_log!(Level::Info, "Killing PTY child process...");
                pty_child_process.kill().unwrap();

                mt_log!(Level::Info, "Breakes the loop. This will terminate the ws socket thread and the ws will close");
                break;
            }
            _ => mt_log!(Level::Error, "Unknown received data type"),
        }
    }

    mt_log!(
        Level::Info,
        "The Websocket was closed and the thread for WS listening will end soon."
    );
}

pub async fn pty_serve() {
    let listener = TcpListener::bind(PTY_SERVER_ADDRESS)
        .await
        .expect("Can't listen");

    while let Ok((stream, _)) = listener.accept().await {
        let peer = stream
            .peer_addr()
            .expect("connected streams should have a peer address");
        mt_log!(Level::Info, "Peer address: {}", peer);

        std::thread::spawn(|| {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                handle_client(stream).await;
            });
        });
    }
}
