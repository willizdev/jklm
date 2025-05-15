use std::{
    collections::HashMap,
    env,
    fs::{self, File},
    io::{self, Write},
    path::Path,
    time::Instant,
};

use chrono::Local;
use serde::{Deserialize, Serialize};

fn main() {
    let now = Local::now();
    let dtf = now.format("%Y-%m-%d %H:%M:%S").to_string();

    println!("Starting JKLM Dictionary Factory ({})", dtf);
    let args: Vec<String> = env::args().collect();

    if args.len() == 1 {
        println!("Please provide a file name in the argument");
        return;
    }

    let mut output = String::from("out/dict.json");

    for i in 2..=args.len() - 1 {
        if args[i] == "-o" {
            if i >= args.len() - 1 {
                println!("Please provide a valid output file name");
                return;
            }
            output = args[i + 1].clone();
        }
    }

    let file = &args[1];
    println!("-> Building dictionary from '{}'", file);

    let fsr = fs::read_to_string(file);
    let content;

    match fsr {
        Ok(text) => content = text,
        Err(_) => {
            println!("Please provide a valid file name");
            return;
        }
    }

    let list: Vec<&str> = content.split("\n").collect();
    let length = list.len();
    let mut count = 0;

    let start = Instant::now();

    println!("-> Creating {} hashmaps", length);
    let mut dict: HashMap<String, HashMap<String, Vec<String>>> = HashMap::new();

    for word in list {
        count += 1;

        let progress = (count as f32 / length as f32) * 100.0;
        print!(
            "\r-> Building dictionary ({}/{}) [{:.0}%]",
            count, length, progress
        );
        std::io::stdout().flush().unwrap();

        add_syllables(&word, 2, &mut dict);
        add_syllables(&word, 3, &mut dict);
    }

    let duration = start.elapsed();
    println!("\nFinished building dictionary in {:.2?}", duration);

    if let Err(e) = save_to_file(&dict, &output) {
        eprintln!("Error saving dictionary: {}", e);
    }
}

fn add_syllables(
    word: &str,
    syllable_len: usize,
    dict: &mut HashMap<String, HashMap<String, Vec<String>>>,
) {
    let chars: Vec<char> = word.chars().collect();
    if chars.len() < syllable_len {
        return;
    }

    for i in 0..=chars.len() - syllable_len {
        let syllable = chars[i..i + syllable_len].iter().collect::<String>();
        let key_len = chars.len().to_string();

        let inner = dict.entry(syllable).or_insert_with(HashMap::new);
        let vec = inner.entry(key_len).or_insert_with(Vec::new);

        if !vec.contains(&word.to_string()) {
            vec.push(word.to_string());
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct Dict {
    #[serde(flatten)]
    pub dict: HashMap<String, HashMap<String, Vec<String>>>,
}

fn save_to_file(
    dict: &HashMap<String, HashMap<String, Vec<String>>>,
    filename: &str,
) -> io::Result<()> {
    let path = Path::new(filename);
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)?;
        }
    }

    let dict = Dict { dict: dict.clone() };
    let json = serde_json::to_string_pretty(&dict)?.replace("  ", "    ");

    let mut file = File::create(filename)?;
    file.write_all(json.as_bytes())?;
    Ok(())
}
