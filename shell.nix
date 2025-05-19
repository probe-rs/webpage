{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [
        # Run Astro
        nodejs_23

        # For generating favicon.ico (to support old browsers?)
        # nix-shell
        # cp src/icons/banner.svg public/favicon.svg
        # magick public/favicon.svg -resize 32 /tmp/favicon_32x32.png
        # magick public/favicon.svg -resize 64 /tmp/favicon_64x64.png
        # icotool -c -o public/favicon.ico /tmp/favicon_32x32.png /tmp/favicon_64x64.png
        icoutils
        imagemagick

        python3
    ];
}