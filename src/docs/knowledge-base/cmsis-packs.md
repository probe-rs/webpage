---
title: "CMSIS Packs"
description: "The CMSIS Pack standard and how probe-rs uses it."
order: 20
---

## Basics

CMSIS-Packs are an ARM mechanism and loose [specification](https://arm-software.github.io/CMSIS_5/Pack/html/cp_Packs.html)
to distribute documentation, flash algorithms, code samples, HALs, etc for an ARM core.

A CMSIS-Pack is supposed to be created by the ARM core manufacturer and can be distributed in decentralized
fashion via a list of sources. Nevertheless, ARM [hosts](https://developer.arm.com/tools-and-software/embedded/cmsis/cmsis-search) the CMSIS-Packs for pretty much any chip you'd ever want.

CMSIS-Packs are ZIP files and contain arbitrary files. The exact structure is manufacturer defined and is
described in the .pdsc file being placed at the root level of the ZIP file.
The .pdsc file is a simple XML file containing all the meta information about the Pack.

Also inside the Pack - most of the time (they can be absent if the manufacturer chooses so) - are the flash
algorithms to flash the chips described by the Pack.
Those are the .FLM files, which are plain old [ELF binaries](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) adhering to a certain defined structure.

## Flash Algorithms

A flash algorithm is a simple program that is executed. It consists of a fixed set of (sometimes optional)
functions which get loaded into RAM and are executed by the flash downloader.
Those functions are described [here](https://arm-software.github.io/CMSIS_5/Pack/html/flashAlgorithm.html).
The same specification also describes the metadata that is stored inside the
ELF binary itself as a debug symbol and inside the .pdsc file.

Both, the loadable ELF symbols, as well as the metadata are required to assemble a fully functional flash
algorithm. This is the job of the flash downloader.
The functions follow standard ARM EABI calling convention.

## YAML format

Since the Packs are full of bloat we don't need, we have introduced a slimmed down format for target
description.
We chose YAML to represent the target as it is a well known format and allows comments.
Every YAML file addresses an entire family of chips equivalent to the CMSIS-Packs.

The yaml format follows the following structure:

```yaml
---
# The name of the chip family.
name: string
# A list of all the chips in the family.
variants:
  # The name of the chip.
  - name: string
    # Descriptions of the CPU cores.
    cores:
        # The name of the core.
      - name: string
        # Architecture
        type: armv6m | armv7a | armv7m | armv7em | armv8a | armv8m | riscv | xtensa
        # Core-specific options. Can be one of: `!Arm {}`, `!Riscv {}`, `!Xtensa {}`
        core_access_options: object
    # A list of all the available memories and their properties.
    memory_map:
      # The type of the memory. Possible are [!Ram, !Nvm, !Generic].
      # There needs to be at least one of !Ram and !Nvm present.
      - !Ram:
          range:
            # The start address of the memory (inclusive).
            start: number
            # The end address of the memory (inclusive).
            end: number
          # Marks the memory as the memory which the chip boots from.
          is_boot_memory: boolean
          # List of cores that can access this region
          cores:
            - core name
      - !Nvm:
          range:
            # The start address of the memory (inclusive).
            start: number
            # The end address of the memory (inclusive).
            end: number
          # Marks the memory as the memory which the chip boots from.
          is_boot_memory: boolean
          # List of cores that can access this region
          cores:
            - core name
      - !Generic:
          range:
            # The start address of the memory (inclusive).
            start: number
            # The end address of the memory (inclusive).
            end: number
          # List of cores that can access this region
          cores:
            - core name
    # A list of all the used flash algorithms.
    flash_algorithms:
      # The name of the flash algorithm.
      - string
# A list of all the available flash algorithms.
flash_algorithms:
    # The name of the flash algorithm.
  - name: string
    # A description of the flash algorithm.
    description: string
    # Marks the algorithm to be used as the default algorithm.
    default: boolean
    # A base 64 encoded ELF binary blob containing
    # all the loadable symbols of the flash algorithm.
    instructions: base64string
    # The position independent address of the init routine.
    pc_init: number
    # The position independent address of the uninit routine.
    pc_uninit: number
    # The position independent address of the program page routine.
    pc_program_page: number
    # The position independent address of the erase sector routine.
    pc_erase_sector: number
    # The position independent address of the erase all routine.
    pc_erase_all: number
    # The offset where the data section of the ELF binary starts.
    data_section_offset: number
    # Encoding (and compression algorithm) supported by the flash algorithm.
    transfer_encoding: raw | miniz
    flash_properties:
      # The address range for which this flash algorithm is to be used.
      address_range:
        # The start address (inclusive).
        start: number
        # The start address (inclusive).
        end: number
      # The programmable block size. This is the unit size that can be written to flash.
      page_size: number
      # The erased value of a byte in flash.
      erased_byte_value: number
      # How long a page program procedure can take.
      program_page_timeout: number
      # How long a sector erase procedure can take.
      erase_sector_timeout: number
      # The sectors this piece of flash consists of. A sector is the erasable unit.
      sectors:
        # The size of the sectors starting form the address below.
        - size: number
          # The address from on which the new sector size is applicable.
          address: number
      # List of cores that can use this algorithm
      cores:
        - core name
```

## Target extraction

Since doing all of this by hand would be madness, we provide a utility called [target-gen](https://github.com/probe-rs/target-gen) which can be used to
extract a family definition. Including all metadata and the ELF blob.

The utility accepts both an unzipped Pack folder as well as the still zipped .pack file, and can even download pack files automatically if required.
Please use `target-gen --help` to see available options.
The generated file can be loaded as a target by probe-rs or submitted as a PR if you think it belongs in the built-in targets provided by probe-rs.
