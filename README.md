# XML Data Integrity Checksum (XDIC)

## Overview

The XML Data Integrity Checksum (XDIC) project provides a standard and reference implementation for embedding checksums in XML files. This approach is designed to ensure the integrity of XML data without altering its schema or content structure. XDIC uses cryptographic hash functions to generate checksums, which are then embedded within the XML files using Processing Instructions (PI).

## Purpose

The primary goal of XDIC is to provide a reliable method for verifying the integrity of XML data across different systems and platforms. This is particularly useful in environments where XML data is exchanged or stored over extended periods, and where maintaining its originality and integrity is crucial.

## Features

- Embeds checksums directly into XML files using PIs.
- Offers a standardized way to verify the integrity of XML data.
- Utilizes widely accepted cryptographic hash functions (e.g., SHA-256).
- Ensures that the XML data hasn't been tampered with or altered.
- Simple and straightforward implementation, similar to the [W3C's Subresource Integrity](https://www.w3.org/TR/SRI/)
- Does not require XML content normalization, ensuring simplicity and performance.

## Getting Started

To begin using XDIC in your projects, clone this repository to your local machine:

    git clone https://github.com/dave1010/XML-Data-Integrity-Checksum.git
    cd XML-Data-Integrity-Checksum

Check out the `src` directory for the reference implementation and the `examples` directory for sample XML files with embedded checksums.

## How It Works

XDIC embeds a [Processing Instruction](https://en.wikipedia.org/wiki/Processing_Instruction) in the XML file containing the checksum value. The checksum covers the entire XML file, excluding the checksum value itself. This way, any alteration in the XML content after the checksum generation invalidates the checksum, signaling potential tampering or corruption.

## Usage

XML files with XDIC include a processing instruction like this:

    <?xdic integrity="sha256-abc123..." normalize="false" version="1.0"?>

This is ignored by systems that do not understand the instruction. The checksum can be used to validate the rest of the XML file. The checksum can also be stored and referenced outside of the XML file.

Refer to the `examples` directory to see how the checksum PI is embedded in XML files. The `src` directory contains the reference implementation showing how to generate and verify checksums.

For detailed information on the checksum generation and verification process, please refer to the [SPECIFICATION.md](SPECIFICATION.md) file.

## Frequently Asked Questions

See the [Frequently Asked Questions](FAQs.md) page.

## Contributing

We welcome contributions to the XDIC project! Whether you're interested in fixing bugs, adding new features, or improving documentation, your help is appreciated. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed to the public domain under CC0 1.0  - see the [LICENSE](LICENSE) file for details.

## Changelog

For a detailed list of changes and updates, please refer to the [CHANGELOG.md](CHANGELOG.md) file.

## Author

- [Dave Hulbert](https://dave.engineer) - Initial work and ongoing maintenance


## Acknowledgments

- Thanks to contributors and community members who have provided valuable feedback and suggestions.
- A tip of the hat to those brave souls who dive into XML files with nothing but a text editor and a dream. Your adventurous spirit has been a key inspiration for this project.


