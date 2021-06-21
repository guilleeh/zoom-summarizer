const PDF = require("pdfkit");

const generatePdf = (title, text, res) => {
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

  pdf
    .fillColor("gray")
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
