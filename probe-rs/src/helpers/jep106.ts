const data = [];

async function fetchJep() {
    const textResponse = await fetch(
        "https://raw.githubusercontent.com/Yatekii/jep106/master/src/codes.rs",
    );
    const textData = (await textResponse.text()).split("\n");
    for (let line of textData) {
        line = line.trim();
        if (line.startsWith("None")) {
            data.push(undefined);
        } else if (line.startsWith("Some")) {
            data.push(line.split('"')[1]);
        }
    }
}

export const getJep106Manufacturer = (cc, id) => {
    return data[cc * 256 + id];
};
