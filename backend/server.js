const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const relatoriosDir = path.join(__dirname, 'public', 'relatorios');
if (!fs.existsSync(relatoriosDir)) {
    fs.mkdirSync(relatoriosDir, { recursive: true });
}

app.use('/relatorios', express.static(relatoriosDir));

app.post('/api/gerar-relatorios', async (req, res) => {
    try {
        const resAlunos = await axios.get("http://localhost:3001/alunos");
        const resTurmas = await axios.get("http://localhost:3001/turmas");
        const resDisciplinas = await axios.get("http://localhost:3001/disciplinas").catch(() => ({ data: [] }));
        
        const alunos = resAlunos.data;
        const turmas = resTurmas.data;
        const disciplinasLista = resDisciplinas.data;

        for (const aluno of alunos) {
            const alunoId = String(aluno.id);
            const turma = turmas.find(t => t.alunos?.map(String).includes(alunoId));
            
            let nomeTurma = "Não vinculada";
            let serieFormatada = "Educação Básica";
            let turmaId = "";
            let disciplinasIds = [];

            if (turma) {
                turmaId = turma.id;
                nomeTurma = turma.nomeTurma || "Turma";
                disciplinasIds = turma.disciplinas || [];
                if (turma.anoSerie === "2") {
                    serieFormatada = "Ensino Fundamental I";
                }
            }

            let disciplinasDetalhes = [];
            let mediaFinalNotas = "0.0";
            let frequenciaGeral = 100;

            if (turmaId) {
                try {
                    const resNotas = await axios.get(`http://localhost:3001/notas?turmaId=${turmaId}`);
                    const notasAluno = resNotas.data.filter(n => String(n.alunoId) === alunoId);
                    
                    let listaSomasDisciplinas = [];
                    
                    const resChamadas = await axios.get(`http://localhost:3001/frequencia?turmaId=${turmaId}`);
                    
                    let totalAulasGeral = 0;
                    let presencasGeral = 0;
                    
                    resChamadas.data.forEach(dia => {
                        const reg = dia.chamada?.find(c => String(c.alunoId) === alunoId);
                        if (reg) {
                            totalAulasGeral++;
                            if (reg.presente === true || reg.presente === "true") {
                                presencasGeral++;
                            }
                        }
                    });
                    
                    if (totalAulasGeral > 0) {
                        frequenciaGeral = Math.round((presencasGeral / totalAulasGeral) * 100);
                    }

                    for (const discId of disciplinasIds) {
                        const discInfo = disciplinasLista.find(d => String(d.id) === String(discId));
                        const nomeDisc = discInfo ? (discInfo.nome || discInfo.nomeDisciplina) : `Disciplina ${discId}`;
                        
                        const notaDisc = notasAluno.find(n => String(n.disciplinaId) === String(discId));
                        let somaD = 0;
                        let countD = 0;
                        
                        if (notaDisc) {
                            [notaDisc.bim1, notaDisc.bim2, notaDisc.bim3, notaDisc.bim4].forEach(b => {
                                if (b !== undefined && b !== "" && b !== null) {
                                    somaD += Number(b);
                                    countD++;
                                }
                            });
                        }
                        
                        let mediaD = somaD.toFixed(1);
                        if (countD > 0) {
                            listaSomasDisciplinas.push(somaD);
                        }
                        
                        let totalAulasD = 0;
                        let presencasD = 0;
                        
                        resChamadas.data.forEach(dia => {
                            if (!dia.disciplinaId || String(dia.disciplinaId) === String(discId)) {
                                const reg = dia.chamada?.find(c => String(c.alunoId) === alunoId);
                                if (reg) {
                                    totalAulasD++;
                                    if (reg.presente === true || reg.presente === "true") {
                                        presencasD++;
                                    }
                                }
                            }
                        });
                        
                        let freqD = totalAulasD > 0 ? `${Math.round((presencasD / totalAulasD) * 100)}%` : "100%";
                        
                        disciplinasDetalhes.push({
                            nome: nomeDisc,
                            media: mediaD,
                            frequencia: freqD
                        });
                    }
                } catch (err) {}
            }

            if (listaSomasDisciplinas.length > 0) {
                const totalDasSomas = listaSomasDisciplinas.reduce((acc, valor) => acc + valor, 0);
                mediaFinalNotas = (totalDasSomas / listaSomasDisciplinas.length).toFixed(1);
            }
            
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { top: 40, bottom: 0, left: 40, right: 40 } 
            });
            
            const fileStream = fs.createWriteStream(path.join(relatoriosDir, `relatorio_${alunoId}.pdf`));
            doc.pipe(fileStream);

            doc.rect(0, 0, 595.28, 140).fill('#1637b7');
            doc.fillColor('#FFFFFF').fontSize(22).text('RELATÓRIO FINAL DE DESEMPENHO', 40, 55, { align: 'center' });

            doc.fillColor('#1637b7').fontSize(14).text('DADOS DO ALUNO', 40, 170);
            doc.moveTo(40, 190).lineTo(555, 190).strokeColor('#1637b7').lineWidth(1).stroke();

            doc.fillColor('#333333').fontSize(11).text(`Nome Completo: ${aluno.nomeAluno}`, 40, 205);
            doc.text(`Turma: ${nomeTurma}`, 40, 225);
            doc.text(`Série / Segmento: ${serieFormatada}`, 40, 245);
            doc.text(`Responsável: ${aluno.nomeResponsavel}`, 40, 265);

            doc.fillColor('#1637b7').fontSize(14).text('DESEMPENHO GLOBAL', 40, 310);
            doc.moveTo(40, 330).lineTo(555, 330).strokeColor('#1637b7').lineWidth(1).stroke();

            doc.rect(40, 350, 240, 70).lineWidth(1).strokeColor('#1637b7').stroke();
            doc.fillColor('#1637b7').fontSize(10).text('MÉDIA GERAL DAS NOTAS', 50, 360, { width: 220, align: 'center' });
            doc.fillColor('#333333').fontSize(20).text(mediaFinalNotas, 50, 385, { width: 220, align: 'center' });

            doc.rect(315, 350, 240, 70).lineWidth(1).strokeColor('#1637b7').stroke();
            doc.fillColor('#1637b7').fontSize(10).text('FREQUÊNCIA FINAL', 325, 360, { width: 220, align: 'center' });
            doc.fillColor('#333333').fontSize(20).text(`${frequenciaGeral}%`, 325, 385, { width: 220, align: 'center' });

            doc.fillColor('#1637b7').fontSize(14).text('DETALHAMENTO POR DISCIPLINA', 40, 450);
            doc.moveTo(40, 470).lineTo(555, 470).strokeColor('#1637b7').lineWidth(1).stroke();

            doc.rect(40, 485, 515, 20).fill('#1637b7');
            doc.fillColor('#FFFFFF').fontSize(10);
            doc.text('Disciplina', 50, 491);
            doc.text('Nota Final', 340, 491);
            doc.text('Frequência', 460, 491);

            let currentY = 515;
            disciplinasDetalhes.forEach(d => {
                doc.fillColor('#333333').fontSize(10);
                doc.text(d.nome, 50, currentY);
                doc.text(d.media, 340, currentY);
                doc.text(d.frequencia, 460, currentY);
                
                doc.moveTo(40, currentY + 15).lineTo(555, currentY + 15).strokeColor('#E0E0E0').lineWidth(0.5).stroke();
                currentY += 25;
            });

            doc.rect(0, 805, 595.28, 36.89).fill('#1637b7');
            doc.fillColor('#FFFFFF').fontSize(9).text('Documento oficial gerado digitalmente pelo Admin Escolar.', 40, 818, { align: 'center' });

            doc.end();
        }

        res.status(200).json({ success: true, message: "Relatórios gerados com sucesso!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3002, () => {});