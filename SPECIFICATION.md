# XML Data Integrity Checksum (XDIC) Specification

## Overview

The XML Data Integrity Checksum (XDIC) is a standard designed to embed checksums within XML files for the purpose of ensuring data integrity. By integrating a checksum directly into an XML file using a Processing Instruction (PI), XDIC provides a method for verifying that the content of the XML document has not been altered or tampered with since the checksum was generated. This specification outlines the format and method for embedding and verifying these checksums, ensuring consistency and reliability across different systems and platforms.

## Definitions

- **Checksum**: A value used to verify the integrity of a file or data set. In XDIC, it is a cryptographic hash function output.
- **Processing Instruction (PI)**: A tag in an XML document that provides additional information to applications processing the XML file. In XDIC, it is used to embed the checksum information.
- **Integrity**: The assurance that data has not been altered or tampered with.
- **XML (eXtensible Markup Language)**: A markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable.
- **Hash Function**: A function that converts an input (or 'message') into a fixed-size string of bytes. The output is typically a 'digest' that represents the original data.
- **SHA-384**: A cryptographic hash function in the SHA-2 family, providing a digest of 384 bits. It's one of the functions used in XDIC for generating checksums.
- **Versioning**: The process of assigning unique version numbers to different stages of the specification and implementation, allowing for tracking changes and updates over time.


## Processing Instruction Format

The XDIC Processing Instruction (PI) is embedded within an XML file to store the checksum information. It follows a specific structure to ensure consistency and ease of parsing.

### Structure

The XDIC PI has the following general structure:

```xml
<?xdic integrity="hash-algorithm-hash-value" version="spec-version" normalize="false"?>
```

### Location

While it is recommended to place the XDIC PI at the beginning of the XML document for visibility and consistency, it is not a strict requirement. Implementations should be prepared to locate and process the XDIC PI regardless of its position within the document.

### Explanation of Attributes

- **integrity**: This attribute combines the hash algorithm used and the hash value, separated by a hyphen (-). The format is "hash-algorithm-hash-value". The hash algorithm should be a recognized cryptographic hash function (e.g., SHA-384), and the hash value is the hexadecimal representation of the checksum.
- **version**: This attribute indicates the version of the XDIC specification used to generate the checksum. It ensures compatibility and helps in understanding how the checksum was calculated, especially if the specification evolves over time.
- **normalize**: This attribute specifies whether the XML content was normalized before the checksum was calculated. In the current version of XDIC, this must always be set to false, indicating that no normalization (such as whitespace removal or comment exclusion) was performed.

### Example of a Complete XDIC PI

Here is an example of a complete XDIC PI embedded in an XML file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xdic integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" version="1.0" normalize="false"?>
<rootElement>
    <!-- XML content goes here -->
</rootElement>
```

In this example, the `integrity` attribute indicates that the SHA-384 algorithm was used and provides the checksum value. The `version` attribute specifies that this PI conforms to version 1.0 of the XDIC specification, and `normalize` is set to `false`, indicating that the checksum was calculated on the unaltered XML file.

## Checksum Generation

This section provides a clear guide on how to generate a checksum for an XML document using the XDIC standard, including supported algorithms, the process steps, and an illustrative example.

### Supported Hash Algorithms

XDIC supports the following cryptographic hash algorithms:
- `sha256`: SHA-256 algorithm, providing a good balance of speed and security for most applications.
- `sha384`: SHA-384 algorithm, offering a higher level of security with a longer hash value.
- `sha512`: SHA-512 algorithm, providing the highest level of security among the supported algorithms with the longest hash value.

### Process for Generating Checksum

1. **Prepare the XML Document**: 
   - Start with the XML content that needs a checksum.
   - Ensure that the XDIC PI is not yet included in the document.

2. **Insert Placeholder Processing Instruction**:
   - While recommended at the beginning, the XDIC PI can be inserted at any location in the document. Insert the XDIC PI with a placeholder for the checksum value.
   - Example: `<?xdic integrity="sha256-" version="1.0" normalize="false"?>`

3. **Serialize the XML Content**:
   - Convert the XML content to a string format, including the placeholder XDIC PI.
   - Ensure that character encoding (e.g., UTF-8) is consistently applied.

4. **Calculate the Checksum**:
   - Choose the appropriate hash algorithm (e.g., `sha256`).
   - Compute the checksum of the entire serialized XML content, excluding the checksum part of the XDIC PI.

5. **Encode the Checksum**:
   - Encode the checksum using base64.
   - Update the XDIC PI with the base64-encoded checksum value.

6. **Finalize the XML Document**:
   - The XML document now contains the complete XDIC PI with the checksum.
   - Example: `<?xdic integrity="sha256-abcd1234..." version="1.0" normalize="false"?>`

### Handling XML Content

- **Include the XDIC PI in Checksum**: The checksum calculation includes the XDIC PI with the placeholder checksum value.
- **Whitespace and Comments**: As `normalize` is set to `false`, whitespace and comments within the XML document are included in the checksum calculation.

### Example

Below is an example illustrating the checksum generation process for a simple XML document using the SHA-256 algorithm:

```xml
<!-- Original XML Document -->
<rootElement>
    <child>Sample Content</child>
    <!-- Comment -->
</rootElement>

<!-- After Inserting Placeholder XDIC PI -->
<?xdic integrity="sha256-" version="1.0" normalize="false"?>
<rootElement>
    <child>Sample Content</child>
    <!-- Comment -->
</rootElement>

<!-- Final XML Document with Checksum -->
<?xdic integrity="sha256-abcd1234..." version="1.0" normalize="false"?>
<rootElement>
    <child>Sample Content</child>
    <!-- Comment -->
</rootElement>
```

In this example, the checksum (`abcd1234...`) is calculated based on the entire content, including the placeholder PI and the comments, and then encoded in base64.

## Checksum Verification

This section describes the process for verifying the checksum embedded in an XML file using the XDIC standard. The verification process ensures that the XML content has not been altered since the checksum was generated.

### Process for Verifying Checksum

1. **Locate and Extract the XDIC PI**:
   - Scan the XML document to locate the XDIC PI. While typically found at the beginning, the PI may be placed elsewhere in the document.
   - Parse the `integrity` attribute to obtain the hash algorithm and the checksum value.
   - Verify the version is supported.
   - Verify the hash algorithm is valid.
   - Verify the `normalize` attribute is `false`.

2. **Remove the Checksum from the XDIC PI**:
   - Temporarily replace the checksum value in the XDIC PI with an empty string.
   - The hash algorithm and the dash must be kept in the `integrity` attribute.
   - This step is crucial to accurately replicate the state of the XML content at the time of checksum generation.

3. **Serialize the XML Content**:
   - Convert the XML content, including the modified XDIC PI, to a string format.
   - Maintain the same character encoding as used during the checksum generation.

4. **Recompute the Checksum**:
   - Using the hash algorithm specified in the XDIC PI, compute the checksum of the serialized XML content.

5. **Compare Checksums**:
   - Encode the newly computed checksum using base64.
   - Compare this checksum with the one extracted from the XDIC PI.
   - If the checksums match, the XML content is verified as unchanged. If they differ, the content has been altered.

### Handling Discrepancies and Potential Errors

- **Checksum Mismatch**: If the recomputed checksum does not match the one in the XDIC PI, it indicates that the XML content has been modified since the checksum was generated. In such cases, handle the XML file as potentially compromised or altered.
- **Missing or Invalid XDIC PI**: If the XDIC PI is missing, malformed, or contains invalid data (e.g., an unsupported hash algorithm), treat the XML content as unverified.
- **Error Handling**: Implement robust error handling in your verification tool to gracefully manage these discrepancies and provide clear error messages or logs.

### Example of Verification Process

Below is an example of how the checksum verification process might be implemented:

```xml
<!-- XML Document with Checksum -->
<?xdic integrity="sha256-abcd1234..." version="1.0" normalize="false"?>
<rootElement>
    <child>Sample Content</child>
    <!-- Comment -->
</rootElement>
```

#### Steps for Verification

1. Extract and parse the XDIC PI, giving the hash algorithm `sha256` and checksum value `abcd1234...`.
2. Remove the checksum value from the PI, resulting in the string `<?xdic integrity="sha256-" version="1.0" normalize="false"?>`
3. Serialize the XML content.
4. Recompute the checksum using the SHA-256 hash algorithm.
5. Compare the new checksum with the one in the XDIC PI.

## Versioning

The XDIC specification employs a versioning system to manage changes and updates to the checksum generation and verification process. This system ensures clarity and consistency as the specification evolves over time.

### Purpose of Versioning

Versioning in XDIC serves to:
- Track changes and improvements made to the checksum process.
- Clearly indicate which version of the specification was used for generating and verifying a checksum.
- Manage compatibility and interoperability across different versions of the specification.

### Version Indication

- Each XDIC PI includes a `version` attribute, specifying the version of the specification used.
- The format of the version follows (MAJOR.MINOR), where:
  - MAJOR version changes indicate significant changes that may impact backward compatibility.
  - MINOR version changes add functionality or bug fixes in a backward-compatible manner.

### Current Version

The current version of the XDIC specification is `1.0`.

### Handling Different Versions

#### Backward Compatibility
- Implementations of XDIC should strive to be backward compatible.
- A newer implementation should be able to verify checksums generated by an older version of the specification.
- Changes that break backward compatibility should result in a new major version.

#### Forward Compatibility
- Implementations should handle unknown future versions cautiously.
- If an implementation encounters an XDIC PI with a **major version higher** than it recognizes, it **must** treat the XML file as unverified. This is to avoid false positives in integrity verification when encountering potentially incompatible specification features introduced in the newer major version.
- If an implementation encounters an XDIC PI with a **minor version higher** than it recognizes (but the major version is supported), it **should** proceed with verification but may warn the user about the potential for unhandled features. Minor version changes typically do not introduce backward-incompatible changes but may include new features or improvements that are not critical to the checksum verification process.
- Implementations can provide a warning or error message indicating the version mismatch.

### Implementation Guidelines
- Implementers are encouraged to regularly update their systems to the latest version of the specification to ensure compatibility with newly generated XML files.
- When developing tools or systems based on XDIC, consider both current and potential future changes in the specification.
- Document the version of the XDIC specification supported by your tool or system, and provide clear guidelines on handling XML files with different version numbers.

By adhering to a structured versioning system, the XDIC specification aims to maintain a balance between innovation and stability, ensuring that enhancements to the standard are managed in a way that respects the needs of a diverse user base.

## Compatibility and Interoperability

Ensuring that XDIC works effectively across different systems, platforms, and XML parsers is crucial for its widespread adoption and utility. This section provides guidance on achieving compatibility and interoperability in various environments.

### XML Parser Variability

- **String-Based Processing**: Given that XDIC operates on the string representation of XML content, it's less dependent on the specific behaviors of XML parsers regarding element handling, whitespace, comments, and character encoding.
- **Consistent Representation**: When implementing XDIC, ensure that the XML content is serialized to a string in a consistent manner across different platforms and parsers. This consistency is key to maintaining the integrity of the checksum process.

### Integration with Existing Workflows

- **Non-Disruptive**: XDIC is designed to be integrated into existing XML workflows without disruption. Its implementation involves simple string manipulation to insert or extract the XDIC PI.
- **Adding XDIC PI**: When adding the XDIC PI to existing XML files, treat the files as text documents to preserve their exact content. This approach ensures that the checksum calculation is based on a consistent string representation.
- **Verification Process**: Similarly, when verifying checksums, extract the PI using string operations, ensuring that the XML file's string representation remains unchanged during the process.

### Cross-Platform Considerations

Implementations of XDIC should strive for uniform behavior across different operating systems and programming languages. Since the primary operation is on strings, this goal is more achievable compared to implementations heavily reliant on XML parsing libraries.

### Testing Recommendations

- **Extensive Testing**: Thoroughly test the implementation of XDIC across various platforms and environments to ensure the checksum remains consistent. This includes testing with different text editors, operating systems, and development environments.
- **Test Scenarios**: Include test cases that cover a range of XML file sizes, structures, and content types to validate the robustness of the checksum process.

## Security Considerations

While the primary goal of XDIC is to ensure data integrity, it is important to understand its scope and limitations in terms of security. This section discusses key security aspects related to the checksum process implemented by XDIC.

### Scope of Security in XDIC

- **Data Integrity, Not Confidentiality**: XDIC focuses on verifying that XML content has not been altered or tampered with since the checksum was generated. It does not provide data confidentiality or prevent unauthorized access to the data.
- **Checksum as a Verification Tool**: The checksum generated by XDIC serves as a verification tool to detect alterations in the XML content. It does not protect against intentional malicious modifications that could recreate a valid checksum.
- **Beyond Checksums**: While XDIC provides a mechanism for integrity checks, it does not offer the authentication and non-repudiation features of digital signatures. Digital signatures not only ensure data integrity but also verify the identity of the data's source and confirm that the data has not been altered since being signed.

### Limitations and Considerations

- **No Protection Against Targeted Tampering**: If an attacker has access to the XML content and the ability to alter the XDIC PI, they could potentially modify the content and update the checksum accordingly. XDIC does not protect against such targeted tampering.
- **Recommendation for Sensitive Data**: For XML documents that require a higher level of security, such as confidential or legally-binding data, it is recommended to complement the XDIC checksum with digital signatures. This combination provides both integrity verification and the security assurances of a signature.
- **Checksum Algorithm Limitations**: The security strength of XDIC is tied to the cryptographic hash function used. Weaknesses or vulnerabilities discovered in the chosen hash algorithm could impact the integrity verification provided by XDIC.
- **Not a Substitute for Comprehensive Security Measures**: XDIC should be used as part of a broader security strategy. It is not a substitute for other security measures such as encryption, access control, or secure transmission protocols.

### Best Practices for Enhancing Security

- **Regular Updates**: Keep the implementation of XDIC updated, especially concerning the hash algorithms, to mitigate risks associated with cryptographic weaknesses.
- **Secure Handling of XML Files**: Ensure secure handling and storage of XML files, using appropriate access controls and encryption where necessary.
- **Awareness and Training**: Educate users and developers about the scope and limitations of XDIC in terms of security, promoting informed usage of the standard.


### Conclusion

By understanding the specific role of XDIC in the broader context of data security and combining it with digital signatures where necessary, users can achieve a more comprehensive security strategy that addresses integrity, authenticity, and non-repudiation.

## Reference Implementation

A reference implementation can be found at [https://github.com/dave1010/XML-Data-Integrity-Checksum](https://github.com/dave1010/XML-Data-Integrity-Checksum).
