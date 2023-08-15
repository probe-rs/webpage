use askama::Template;
use probe_rs_target::ChipFamily; // bring trait in scope

#[derive(Template)] // this will generate the code...
#[template(path = "main.html")] // using the template in this path, relative
                                // to the `templates` dir in the crate root
struct Render {
    families: Vec<ChipFamily>,
}

pub fn render(path: &str, families: Vec<ChipFamily>) {
    let rendered = Render { families };
    std::fs::write(path, rendered.render().unwrap()).unwrap();
}

// Any filter defined in the module `filters` is accessible in your template.
mod filters {
    use bytesize::ByteSize;

    // This filter does not have extra arguments
    pub fn bytes(s: &u64) -> ::askama::Result<String> {
        Ok(ByteSize(*s).to_string_as(true))
    }
}
