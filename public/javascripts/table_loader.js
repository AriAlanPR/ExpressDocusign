var dsfilltable = (tableid, data_docusign) => {
    var table = document.getElementById(tableid);

    if(Array.isArray(data_docusign)){
        data_docusign.forEach((envelope, i) => {
            var row = table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = envelope.status;
            cell2.innerHTML = envelope.documentsUri;
        });
    }
}