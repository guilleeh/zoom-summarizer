const PDF = require("pdfkit");

const generatePdf = (title, text, terms, res) => {
  const pdf = new PDF({ bufferPages: true });

  let buffers = [];
  pdf.on("data", buffers.push.bind(buffers));
  pdf.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-disposition": `attachment;filename=${title}.pdf`,
      })
      .end(pdfData);
  });

  pdf.font("Times-Roman").fontSize(20).text(title, {
    align: "center",
    paragraphGap: 20,
  });

  pdf.font("Times-Roman").fontSize(12).text(text, {
    lineGap: 20,
  });

  if (terms) {
    const termsArr = terms.results.sort((a, b) => b.rank - a.rank);
    const cleanedTerms = termsArr.map((term) => term.text);

    pdf.font("Times-Roman").fontSize(16).text("Key Terms", {
      align: "center",
      paragraphGap: 20,
    });

    pdf
      .font("Times-Roman")
      .fontSize(12)
      .list(cleanedTerms, { listType: "numbered" });
  }

  pdf
    .fillColor("gray")
    .fontSize(12)
    .text(
      "Transcript provided by AssemblyAI ",
      pdf.page.width - 200,
      pdf.page.height - 25,
      {
        lineBreak: false,
        align: "center",
      }
    );
  pdf.end();
};

module.exports = {
  generatePdf,
};
