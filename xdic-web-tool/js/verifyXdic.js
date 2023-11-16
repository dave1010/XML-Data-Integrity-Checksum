/**
 * Verifies the XDIC hash of a given XML string.
 * @param {string} xmlString - The XML content as a string.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the hash is verified, `false` otherwise.
 */
function verifyXdicHash(xmlString) {
    return new Promise((resolve, reject) => {
        try {
            // Step 1: Locate and Extract the XDIC PI
            const piRegex = /<\?xdic integrity="([^"]+)" version="([^"]+)" normalize="([^"]+)"\?>/i;
            const matches = xmlString.match(piRegex);
            if (!matches) {
                throw new Error("XDIC Processing Instruction not found.");
            }

            const [fullPi, integrity, version, normalize] = matches;
            const [algorithm, checksumValue] = integrity.split('-');

            const algorithmMap = {
                'sha256': 'SHA-256',
                'sha384': 'SHA-384',
                'sha512': 'SHA-512'
            };

            // Verify version (allowing minor version updates within major version 1)
            const majorVersion = version.split('.')[0];

            if (majorVersion !== "1") {
                throw new Error("Unsupported XDIC major version. Only major version 1 is supported.");
            }

            const normalizedAlgorithm = algorithmMap[algorithm.toLowerCase()];
            if (!normalizedAlgorithm) {
                throw new Error("Unsupported hash algorithm.");
            }

            if (normalize !== "false") {
                throw new Error("Normalize attribute must be 'false'.");
            }

            // Step 2: Remove the Checksum from the XDIC PI
            const modifiedXmlString = xmlString.replace(fullPi, `<?xdic integrity="${algorithm}-" version="${version}" normalize="${normalize}"?>`);

            // Step 3: Serialize the XML Content
            // (already in string format, so no additional action required)

            // Step 4: Recompute the Checksum
            const encoder = new TextEncoder();
            const data = encoder.encode(modifiedXmlString);

            const compareChecksums = hashBuffer => {
                // Step 5: Compare Checksums
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const recomputedChecksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                const isVerified = checksumValue === recomputedChecksum;

                resolve(isVerified);
            };

            crypto.subtle.digest(normalizedAlgorithm, data)
                    .then(compareChecksums)
                    .catch(error => reject(error.message));
        } catch (error) {
            reject(error.message);
        }
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { verifyXdicHash };
} else {
    window.verifyXdicHash = verifyXdicHash;
}
