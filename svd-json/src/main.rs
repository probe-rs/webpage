fn main() {
    use svd_parser as svd;

    use std::fs::File;
    use std::io::Read;

    let xml = &mut String::new();
    File::open("../nrf52.svd")
        .unwrap()
        .read_to_string(xml)
        .unwrap();

    let json = svd::parse(xml).unwrap();
    let json_string = serde_json::to_string_pretty(&json).unwrap();
    std::fs::write(std::path::Path::new("../nrf52.json"), json_string).unwrap();
}
