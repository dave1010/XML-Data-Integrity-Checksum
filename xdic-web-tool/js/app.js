document.getElementById('upload-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', handleFileSelect);
document.getElementById('drop-zone').addEventListener('drop', handleFileDrop);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleFileDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        verifyXdicHash(content)
            .then(isValid => {
                document.getElementById('verification-result').textContent = isValid ? 'Valid XDIC Hash.' : 'Invalid or no XDIC Hash.';
            })
            .catch(error => {
                document.getElementById('verification-result').textContent = 'Error: ' + error;
                document.getElementById('add-xdic-button').hidden = false;
            });

        document.getElementById('add-xdic-button').addEventListener('click', () => {
            generateXdicHash(content)
                .then(updatedXml => {
                    downloadFile(updatedXml, file.name);
                })
                .catch(error => {
                    console.error('Error generating XDIC:', error);
                });
        });
    };
    reader.readAsText(file);
}

function downloadFile(data, filename) {
    const blob = new Blob([data], {type: 'text/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.getElementById('drop-zone').addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}