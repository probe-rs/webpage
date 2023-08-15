mod render;

use std::{fs::File, io::BufReader};

use probe_rs_target::ChipFamily;

#[tokio::main]
async fn main() {
    let path = "../../probe-rs/probe-rs/targets";
    let directory = std::fs::read_dir(path).unwrap();

    let mut families = vec![];
    for file in directory {
        let entry = file.unwrap();
        println!("Name: {}", entry.path().display());
        let family: ChipFamily =
            serde_yaml::from_reader(BufReader::new(File::open(entry.path()).unwrap())).unwrap();
        families.push(family);
    }

    render::render("../templates/families.html", families);
}
