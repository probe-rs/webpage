/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param use_si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param decimal_points Number of decimal places to display.
 *
 * @return Formatted string.
 */
export default function humanFileSize(bytes: number, use_si: boolean = false, decimal_points: number = 1) {
    const thresh = use_si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }

    const units = use_si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** decimal_points;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return bytes.toFixed(decimal_points) + " " + units[u];
}
