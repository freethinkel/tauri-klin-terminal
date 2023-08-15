use std::{collections::HashMap, env, process::Command};

use futures::future::{self, FutureFrom};
use futures::task::spawn;
use futures::unsync::oneshot::spawn_fn;
use futures::{Future, Stream};
use futures::{IntoFuture, Poll};
use libc::c_ushort;
use simple_websockets::{Event, Message, Responder};
use tokio_codec::{BytesCodec, Decoder, FramedRead};
use tokio_io::{AsyncRead, AsyncWrite};
use tokio_pty_process::{
    AsAsyncPtyFd, AsyncPtyMaster, AsyncPtyMasterReadHalf, AsyncPtyMasterWriteHalf, Child,
    CommandExt, PtyMaster,
};

use std::io::Write;

use crate::socket_term::messages::{StdinCommand, TermMessage};

use self::messages::StdoutCommand;

mod messages;

struct TermClient {
    responder: Responder,
    pty_write: AsyncPtyMasterWriteHalf,
    child: Option<Child>,
    command: Command,
}

impl TermClient {
    pub fn new(term_client: TermClient) -> Self {
        return term_client;
    }
    pub fn start(self: &mut Self) {
        // let mut pty_read = &self.pty_read;
        // let reader = FramedRead::new(pty_read, BytesCodec::new());
        // reader.for_each(f)
        // reader.for_each(move |chunk| {
        //     println!("test {:?}", chunk);

        //     return future::ok(());
        //     // return FutureFrom::future_from(chunk);
        //     // return chunk;
        // });

        // self.pty_read.poll_read
    }
    pub fn stop(self: &mut Self) {
        let mut child = self.child.take().expect("test");
        match child.kill() {
            Ok(()) => match child.wait() {
                Ok(exit) => info!("Child died: {:?}", exit),
                Err(e) => error!("Child wouldn't die: {}", e),
            },
            Err(e) => error!("Could not kill child with PID {}: {}", child.id(), e),
        };
    }
}

fn create_command() -> Command {
    let mut cmd = Command::new("login");
    cmd.args(["-fp", env::var("USER").unwrap().as_str()]);
    cmd.env("TERM", "xterm");
    cmd.envs(env::vars());
    return cmd;
}

fn create_term_client(responder: Responder) -> Option<TermClient> {
    let pty = match AsyncPtyMaster::open() {
        Err(e) => {
            println!("Unable to open PTY: {:?}", e);
            responder.close();
            return None;
        }
        Ok(pty) => pty,
    };
    let mut command = create_command();

    let child = match command.spawn_pty_async(&pty) {
        Err(e) => {
            println!("Unable to spawn child: {:?}", e);
            responder.close();
            return None;
        }
        Ok(child) => child,
    };

    println!("Spawned new child process with PID {}", child.id());

    let (pty_read, pty_write) = pty.split();

    let _ = FramedRead::new(pty_read, BytesCodec::new())
        .for_each(|b| {
            println!("data: {:?}", b);
            let msg = String::from_utf8_lossy(b.as_ref()).to_string();
            let _ = &responder.send(Message::Text(
                serde_json::to_string(&StdoutCommand { output: msg }).unwrap(),
            ));
            Ok(())
        })
        .into_stream();

    println!("inited");

    // let mut framed = FramedRead::new(pty_read, BytesCodec::new());
    // let (writer, reader) = framed.split();
    // reader.for_each(move |chunk| {
    //     println!("{:?}", chunk);
    //     return Ok(());
    // });

    return Some(TermClient::new(TermClient {
        responder: responder,
        pty_write: pty_write,
        child: Some(child),
        command: command,
    }));
}

pub fn launch() {
    let event_hub = simple_websockets::launch(8080).expect("failed to listen on port 8080");
    // map between client ids and the client's `Responder`:
    let mut clients: HashMap<u64, TermClient> = HashMap::new();

    loop {
        match event_hub.poll_event() {
            Event::Connect(client_id, responder) => {
                println!("A client connected with id #{}", client_id);
                let mut term_client = match create_term_client(responder) {
                    Some(term_client) => term_client,
                    None => return,
                };

                clients.insert(client_id, term_client);
            }
            Event::Disconnect(client_id) => {
                println!("Client #{} disconnected.", client_id);
                let term_client = clients.get_mut(&client_id);
                match term_client {
                    Some(term_client) => {
                        term_client.stop();
                    }
                    None => {
                        println!("err");
                    }
                };
                // remove the disconnected client from the clients map:
                clients.remove(&client_id);
            }
            Event::Message(client_id, message) => {
                println!(
                    "Received a message from client #{}: {:?}",
                    client_id, message
                );
                let mut term_client = clients.get_mut(&client_id).unwrap();

                match message {
                    Message::Binary(bin) => {}
                    Message::Text(text) => {
                        let _ = match TermMessage::from_json(text.as_str()) {
                            TermMessage::ResizeCommand(resize) => {
                                print!("resize: {:?}", resize);
                                Resize::new(
                                    &*&mut term_client.pty_write,
                                    resize.rows.try_into().unwrap(),
                                    resize.cols.try_into().unwrap(),
                                );
                            }
                            TermMessage::StdinCommand(stdin) => {
                                let buf = stdin.input.as_str().as_bytes();
                                print!("stdin: {:?}", buf);
                                let _ = term_client.pty_write.write(buf);
                            }
                            _ => {}
                        };
                    }
                }

                // let responder = clients.get(&client_id).unwrap();
                // responder
                //     .responder
                //     .send(Message::Text(String::from("Hello")));
            }
        }
    }
}

pub struct Resize<T: PtyMaster> {
    pty: T,
    rows: c_ushort,
    cols: c_ushort,
}

impl<T: PtyMaster> Resize<T> {
    pub fn new(pty: T, rows: c_ushort, cols: c_ushort) -> Self {
        Self { pty, rows, cols }
    }
}

impl<T: PtyMaster> Future for Resize<T> {
    type Item = ();
    type Error = std::io::Error;

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        self.pty.resize(self.rows, self.cols)
    }
}
