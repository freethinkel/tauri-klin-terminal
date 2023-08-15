use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ResizeCommand {
    pub _type: String,
    pub cols: i64,
    pub rows: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StdinCommand {
    pub input: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StdoutCommand {
    pub output: String,
}

pub enum TermMessage {
    StdinCommand(StdinCommand),
    StdoutCommand(StdoutCommand),
    ResizeCommand(ResizeCommand),
    Unknown,
}

impl TermMessage {
    pub fn from_json(json: &str) -> Self {
        let value: serde_json::Value = serde_json::from_str(json).expect("error json parse");

        match serde_json::from_str(json) {
            Ok(resize) => TermMessage::ResizeCommand(resize),
            Err(_) => match serde_json::from_str(json) {
                Ok(stdin) => TermMessage::StdinCommand(stdin),
                Err(_) => TermMessage::Unknown,
            },
        }
    }
}
