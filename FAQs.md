# XML Data Integrity Checksum (XDIC) Frequently Asked Questions

### How do I check an XDIC hash?

If you need to verify the integrity of an XML file with an embedded XDIC hash, there are several approaches you can take:

1. **Use a Library or Tool**: The easiest and most reliable way to check an XDIC hash is by using a library or tool specifically designed for this purpose. These tools are built to handle the nuances of XDIC, including the correct extraction of the Processing Instruction (PI) and the computation of the checksum. Look for libraries or tools that are compatible with your programming environment and have support for XDIC.

2. **Refer to the Reference Implementation**: If you are developing your own tool or if you want to understand the process in more detail, refer to the reference implementation provided with the XDIC project. This implementation serves as a practical example of how to correctly compute and verify XDIC hashes according to the specification.

3. **Follow the XDIC Specification**: For a deep understanding of the process, you can consult the XDIC specification directly. The specification provides a step-by-step guide on how the checksum is generated and verified, including how to handle the XML content and the Processing Instruction.

Remember, correctly checking an XDIC hash involves more than just computing a hash value; it also requires proper handling of the XML content and the XDIC Processing Instruction. Using established tools or the reference implementation ensures that these aspects are correctly addressed.

## What is an XML Processing Instruction?

An XML Processing Instruction (PI) is a special kind of node in an XML document that provides instructions to applications processing the XML data. PIs are not part of the document's character data but can affect how the document is handled. In XDIC, a PI is used to embed checksum information directly into the XML file.

## Why is the XML not normalized?

In XDIC, the XML is not normalized before checksum calculation to maintain the exact format and content of the original document. Normalization, like removing whitespace or standardizing line breaks, could alter the file in ways that are not part of its original content. By avoiding normalization, XDIC ensures that the checksum represents the file precisely as it is.

## How is this similar to Subresource Integrity?

[Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) is a security feature that allows browsers to verify that resources fetched from a server (like scripts or stylesheets) are delivered without unexpected manipulation. XDIC is similar in that it also provides a way to ensure the integrity of data (XML files in this case) by using a checksum. Both SRI and XDIC use cryptographic hashes and embed these hashes in a way that they can be checked against the content they represent.

## How is this different from XML Signatures?

XML Signature and XDIC are both standards for ensuring the integrity of XML data, but they serve different purposes and have distinct implementations.

**[XML Signature](https://www.w3.org/TR/xmldsig-core/)** is a comprehensive solution that provides data integrity, authentication, and non-repudiation. It involves complex cryptographic operations, including digital signatures using public and private keys. This makes it suitable for scenarios where verifying the authenticity of the document's source is as important as ensuring its integrity. However, this complexity requires careful key management and deeper understanding of cryptographic principles. Additionally, integrating XML Signature might necessitate adjustments to existing XML schemas and workflows, especially in systems that enforce strict schema validation.

**XDIC**, on the other hand, focuses solely on data integrity. It embeds a checksum within the XML file using a Processing Instruction, providing a straightforward way to verify that the content has not been altered. This simplicity makes XDIC easier to implement and maintain, especially in environments where resources are limited or where a lightweight solution is preferred. Unlike XML Signature, XDIC does not require key management or schema modifications, making it more adaptable to a variety of systems. Furthermore, XDIC's inclusion of all file aspects, including whitespace, in the integrity check can be more comprehensive in certain use cases.

## Why is the hash inside the file itself?

Placing the hash inside the file as a Processing Instruction allows the integrity of the entire file to be checked in a self-contained manner. It ensures that the checksum is always associated with the file, reducing the risk of mismatch or loss that can occur when checksums are stored separately.

## Why does the checksum include the Processing Instruction placeholder?

The checksum includes the processing instruction placeholder to ensure that any changes to the file, including modifications to the PI itself, will invalidate the checksum. This approach provides a comprehensive integrity check of the entire file content, including the PI.

## Why can the Processing Instruction be anywhere, like at the top or bottom?

Allowing the PI to be placed anywhere in the file, though recommended at the top for visibility, provides flexibility in integrating XDIC with various XML structures and workflows. This flexibility ensures that XDIC can be adopted in a wide range of environments without requiring significant changes to existing XML documents.

