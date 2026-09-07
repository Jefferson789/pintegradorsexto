import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private readonly logoPath = 'images/AtanasioViteri.png';

    private addHeader(
        doc: jsPDF,
        title: string
    ): void {
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.rect(
            0,
            0,
            210,
            20,
            'F'
        );
        doc.setTextColor(255);
        doc.setFontSize(14);
        doc.text(
            'SIADE',
            14,
            13
        );
        doc.setFontSize(11);
        doc.text(
            title,
            196,
            13,
            {
                align: 'right'
            }
        );
        doc.setTextColor(0);
    }

    private addFooter(
        doc: jsPDF
    ): void {
        const pageCount =
            doc.getNumberOfPages();
        for (
            let i = 1;
            i <= pageCount;
            i++
        ) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(
                `SIADE • Página ${i} de ${pageCount}`,
                105,
                290,
                {
                    align: 'center'
                }
            );
        }
    }

    async generateDashboardReport(
        metrics: any,
        factores: any[],
        estudiantes: any[]
    ): Promise<void> {
        const doc = new jsPDF();
        const today =
            new Date()
                .toLocaleDateString();
        const porcentajeAlto =
            (
                metrics.riesgoAlto /
                metrics.totalEstudiantes
            ) * 100;
        /*
        PORTADA
        */
        const logo =
            await this.loadImageAsBase64(
                this.logoPath
            );
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.rect(
            0,
            0,
            210,
            120,
            'F'
        );
        doc.addImage(
            logo,
            'PNG',
            80,
            10,
            50,
            50
        );
        doc.setTextColor(255);
        doc.setFontSize(15);
        doc.text(
            'UNIDAD EDUCATIVA FISCAL',
            105,
            75,
            {
                align: 'center'
            }
        );
        doc.text(
            'ATANASIO VITERI',
            105,
            85,
            {
                align: 'center'
            }
        );
        doc.setFontSize(11);
        doc.text(
            'Sistema Inteligente para la Detección Temprana',
            105,
            100,
            {
                align: 'center'
            }
        );
        doc.text(
            'y Prevención del Abandono Escolar',
            105,
            108,
            {
                align: 'center'
            }
        );
        doc.setTextColor(0);
        doc.setFontSize(22);
        doc.text(
            'REPORTE EJECUTIVO',
            105,
            155,
            {
                align: 'center'
            }
        );
        doc.text(
            'INSTITUCIONAL',
            105,
            168,
            {
                align: 'center'
            }
        );
        doc.setFontSize(14);
        doc.text(
            `${metrics.totalEstudiantes} ESTUDIANTES ANALIZADOS`,
            105,
            215,
            {
                align: 'center'
            }
        );
        doc.setFontSize(13);
        doc.text(
            `RIESGO ALTO: ${metrics.riesgoAlto}`,
            105,
            235,
            {
                align: 'center'
            }
        );
        doc.setFontSize(28);
        doc.text(
            `${porcentajeAlto.toFixed(1)}%`,
            105,
            255,
            {
                align: 'center'
            }
        );
        doc.setFontSize(11);
        doc.text(
            `Generado el ${today}`,
            105,
            280,
            {
                align: 'center'
            }
        );
        /*
        RESUMEN EJECUTIVO INSTITUCIONAL
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Resumen Ejecutivo'
        );
        doc.setFontSize(20);
        doc.text(
            'Resumen Ejecutivo Institucional',
            14,
            35
        );
        const cardW = 80;
        const cardH = 45;
        /*
          CARDS
        */
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            50,
            cardW,
            cardH,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            110,
            50,
            cardW,
            cardH,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            14,
            110,
            cardW,
            cardH,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            110,
            110,
            cardW,
            cardH,
            4,
            4,
            'F'
        );
        doc.setFontSize(12);
        doc.text(
            'Estudiantes',
            54,
            68,
            { align: 'center' }
        );
        doc.text(
            'Riesgo Alto',
            150,
            68,
            { align: 'center' }
        );
        doc.text(
            'Intervenciones',
            54,
            128,
            { align: 'center' }
        );
        doc.text(
            'Asistencia',
            150,
            128,
            { align: 'center' }
        );
        doc.setFontSize(20);
        doc.text(
            `${metrics.totalEstudiantes}`,
            54,
            88,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.riesgoAlto}`,
            150,
            88,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.totalIntervenciones}`,
            54,
            148,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.promedioAsistencia}%`,
            150,
            148,
            {
                align: 'center'
            }
        );
        /*
        ANÁLISIS INSTITUCIONAL
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Análisis Institucional'
        );
        doc.setFontSize(20);
        doc.text(
            'Análisis Institucional',
            14,
            35
        );
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            50,
            182,
            165,
            4,
            4,
            'F'
        );
        const factorPrincipalInstitucional =
            factores[0]?.factor ??
            'Sin datos';
        const analisisInstitucional = `
Durante el período evaluado se analizaron ${metrics.totalEstudiantes} estudiantes mediante SIADE.
Se identificaron ${metrics.riesgoAlto} estudiantes clasificados en riesgo alto, representando aproximadamente ${porcentajeAlto.toFixed(1)}% de la población estudiantil evaluada.
El principal factor de riesgo detectado corresponde a ${factorPrincipalInstitucional}.
La institución registra una asistencia promedio de ${metrics.promedioAsistencia}% y un promedio académico general de ${metrics.promedioAcademico}.
Durante el periodo analizado se registraron ${metrics.totalIntervenciones} intervenciones institucionales orientadas a la prevención del abandono escolar.
La evidencia observada sugiere mantener estrategias preventivas enfocadas en identificación temprana, seguimiento continuo y fortalecimiento del acompañamiento académico y socioeducativo.
`;
        const lineasAnalisisInstitucional =
            doc.splitTextToSize(
                analisisInstitucional.trim(),
                145
            );
        doc.setFontSize(12);
        doc.text(
            lineasAnalisisInstitucional,
            25,
            70
        );
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.roundedRect(
            14,
            230,
            182,
            30,
            4,
            4,
            'F'
        );
        doc.setTextColor(
            255
        );
        doc.setFontSize(13);
        doc.text(
            `RIESGO ALTO ${metrics.riesgoAlto}  •  FACTOR PRINCIPAL ${factorPrincipalInstitucional}`,
            20,
            248
        );
        doc.setTextColor(
            0
        );
        /*
        FACTORES DE RIESGO INSTITUCIONALES
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Factores de Riesgo'
        );
        doc.setFontSize(20);
        doc.text(
            'Factores de Riesgo Institucionales',
            14,
            35
        );
        doc.setFontSize(11);
        doc.text(
            'Principales factores asociados al riesgo de abandono escolar detectados durante el período analizado.',
            14,
            48
        );
        autoTable(doc, {
            startY: 60,
            head: [[
                'Ranking',
                'Factor',
                'Casos'
            ]],
            body:
                factores.map(
                    (
                        factor,
                        index
                    ) => [
                            index + 1,
                            factor.factor,
                            factor.cantidad
                        ]
                ),
            headStyles: {
                fillColor: [36, 83, 138],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: {
                    cellWidth: 25
                },
                2: {
                    halign: 'center'
                }
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            }
        });
        /*
        ESTUDIANTES PRIORITARIOS
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Estudiantes Prioritarios'
        );
        doc.setFontSize(20);
        doc.text(
            'Estudiantes Prioritarios',
            14,
            35
        );
        doc.setFontSize(11);
        doc.text(
            'Estudiantes con mayor probabilidad de abandono escolar según la evaluación realizada por SIADE.',
            14,
            48
        );
        /*
          TOP 10
        */
        const topEstudiantes = [...estudiantes]
            .sort(
                (a: any, b: any) =>
                    Number(b.porcentaje) -
                    Number(a.porcentaje)
            )
            .slice(0, 10);
        autoTable(doc, {
            startY: 60,
            head: [[
                'Estudiante',
                'Probabilidad',
                'Nivel'
            ]],
            body: topEstudiantes.map(
                (estudiante: any) => [
                    `${estudiante.estudiante.nombres} ${estudiante.estudiante.apellidos}`,
                    `${estudiante.porcentaje}%`,
                    estudiante.nivel_riesgo
                ]
            ),
            headStyles: {
                fillColor: [36, 83, 138],
                textColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            },
            columnStyles: {
                1: {
                    halign: 'center'
                },
                2: {
                    halign: 'center'
                }
            }
        });
        const finalY =
            (doc as any)?.lastAutoTable?.finalY ?? 200;
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.roundedRect(
            14,
            finalY + 15,
            182,
            25,
            4,
            4,
            'F'
        );
        doc.setTextColor(255);
        doc.setFontSize(12);
        doc.text(
            `RIESGO ALTO: ${metrics.riesgoAlto} • ESTUDIANTES MOSTRADOS: ${topEstudiantes.length}`,
            20,
            finalY + 31
        );
        doc.setTextColor(0);
        /*
        PLAN DE ACCIÓN INSTITUCIONAL
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Plan de Acción Institucional'
        );
        doc.setFontSize(20);
        doc.text(
            'Plan de Acción Institucional',
            14,
            35
        );
        /*
        DIAGNÓSTICO
        */
        const factorPrincipal =
            factores[0]?.factor ??
            'Sin datos';
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            50,
            85,
            40,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            111,
            50,
            85,
            40,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            14,
            100,
            85,
            40,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            111,
            100,
            85,
            40,
            4,
            4,
            'F'
        );
        doc.setFontSize(10);
        doc.text(
            'Estudiantes',
            56,
            65,
            {
                align: 'center'
            }
        );
        doc.text(
            'Riesgo Alto',
            153,
            65,
            {
                align: 'center'
            }
        );
        doc.text(
            'Asistencia',
            56,
            115,
            {
                align: 'center'
            }
        );
        doc.text(
            'Intervenciones',
            153,
            115,
            {
                align: 'center'
            }
        );
        doc.setFontSize(18);
        doc.text(
            `${metrics.totalEstudiantes}`,
            56,
            82,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.riesgoAlto}`,
            153,
            82,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.promedioAsistencia}%`,
            56,
            132,
            {
                align: 'center'
            }
        );
        doc.text(
            `${metrics.totalIntervenciones}`,
            153,
            132,
            {
                align: 'center'
            }
        );
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            150,
            182,
            20,
            4,
            4,
            'F'
        );
        doc.setFontSize(11);
        doc.text(
            `Factor principal: ${factorPrincipal}`,
            20,
            163
        );
        /*
          RECOMENDACIONES
        */
        const accionesInstitucionales: string[] = [];
        if (porcentajeAlto >= 20) {
            accionesInstitucionales.push(
                'Priorizar el seguimiento de estudiantes clasificados en riesgo alto.'
            );
        }
        if (metrics.promedioAsistencia < 90) {
            accionesInstitucionales.push(
                'Fortalecer estrategias institucionales de asistencia y permanencia escolar.'
            );
        }
        if (factores.length > 0) {
            accionesInstitucionales.push(
                `Implementar acciones preventivas relacionadas con "${factorPrincipal}".`
            );
        }
        accionesInstitucionales.push(
            'Mantener monitoreo permanente mediante SIADE.'
        );
        doc.setFontSize(16);
        doc.text(
            'Acciones Recomendadas',
            14,
            190
        );
        doc.setFontSize(10);
        let yAccion = 205;
        accionesInstitucionales.forEach(
            (accion: string, index: number) => {
                const lineas =
                    doc.splitTextToSize(
                        `${index + 1}. ${accion}`,
                        160
                    );
                const altura =
                    Math.max(
                        12,
                        lineas.length * 5
                    );
                doc.setFillColor(
                    245,
                    247,
                    250
                );
                doc.roundedRect(
                    14,
                    yAccion - 10,
                    182,
                    altura,
                    4,
                    4,
                    'F'
                );
                doc.text(
                    lineas,
                    20,
                    yAccion
                );
                yAccion += altura + 10;
            }
        );
        /*
          RESUMEN FINAL
        */
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.setTextColor(255);
        doc.setFontSize(12);
        const resumenY = yAccion + 10;
        doc.roundedRect(
            14,
            resumenY,
            182,
            20,
            4,
            4,
            'F'
        );
        doc.text(
            `RIESGO ALTO: ${metrics.riesgoAlto} • FACTOR PRINCIPAL: ${factorPrincipal}`,
            105,
            resumenY + 13,
            {
                align: 'center'
            }
        );
        doc.setTextColor(0);
        this.addFooter(doc);
        doc.save(
            `reporte-ejecutivo-siade-${Date.now()}.pdf`
        );
    }

    async generateStudentReport(
        estudiante: any,
        alerta: any,
        intervenciones: any[]
    ): Promise<void> {
        const doc = new jsPDF();
        const today =
            new Date()
                .toLocaleDateString();
        const porcentaje =
            alerta
                ? Number(
                    alerta.probabilidad_abandono
                ) * 100
                : 0;
        const logo =
            await this.loadImageAsBase64(
                this.logoPath
            );
        /*
        PORTADA
        */
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.rect(
            0,
            0,
            210,
            120,
            'F'
        );
        doc.addImage(
            logo,
            'PNG',
            80,
            10,
            50,
            50
        );
        doc.setTextColor(255);
        doc.setFontSize(15);
        doc.text(
            'UNIDAD EDUCATIVA FISCAL',
            105,
            75,
            {
                align: 'center'
            }
        );
        doc.text(
            'ATANASIO VITERI',
            105,
            85,
            {
                align: 'center'
            }
        );
        doc.setFontSize(11);
        doc.text(
            'Sistema Inteligente para la Detección Temprana',
            105,
            100,
            {
                align: 'center'
            }
        );
        doc.text(
            'y Prevención del Abandono Escolar',
            105,
            108,
            {
                align: 'center'
            }
        );
        doc.setTextColor(0);
        doc.setFontSize(22);
        doc.text(
            'REPORTE INDIVIDUAL',
            105,
            155,
            {
                align: 'center'
            }
        );
        doc.text(
            'DE RIESGO ESTUDIANTIL',
            105,
            168,
            {
                align: 'center'
            }
        );
        doc.setFontSize(13);
        doc.text(
            estudiante.curso?.nombre ?? '',
            105,
            214,
            {
                align: 'center'
            }
        );
        const nivelRiesgo =
            (alerta?.nivel_riesgo ?? 'sin_riesgo')
                .toUpperCase();
        doc.setFontSize(13);
        doc.text(
            `RIESGO: ${nivelRiesgo}`,
            105,
            235,
            {
                align: 'center'
            }
        );
        doc.setFontSize(30);
        doc.text(
            `${porcentaje.toFixed(0)}%`,
            105,
            252,
            {
                align: 'center'
            }
        );
        doc.setFontSize(11);
        doc.text(
            `Generado el ${today}`,
            105,
            280,
            {
                align: 'center'
            }
        );
        /*
        RESUMEN DEL CASO
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Resumen del Caso'
        );
        doc.setFontSize(20);
        doc.text(
            'Resumen Ejecutivo del Caso',
            14,
            35
        );
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            45,
            182,
            45,
            4,
            4,
            'F'
        );
        doc.setFontSize(11);
        doc.text(
            `Estudiante: ${estudiante.nombres} ${estudiante.apellidos}`,
            20,
            60
        );
        doc.text(
            `Curso: ${estudiante.curso?.nombre ?? ''}`,
            20,
            72
        );
        doc.text(
            `Cédula: ${estudiante.cedula}`,
            20,
            84
        );
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            100,
            182,
            55,
            4,
            4,
            'F'
        );
        doc.setFontSize(13);
        doc.text(
            'Información Familiar',
            20,
            115
        );
        doc.setFontSize(11);
        doc.text(
            `Representante: ${estudiante.familia?.nombre_representante ?? 'No registrado'}`,
            20,
            128
        );
        doc.text(
            `Parentesco: ${estudiante.familia?.parentesco ?? 'No registrado'}`,
            20,
            140
        );
        doc.text(
            `Ingreso Familiar: $${estudiante.familia?.ingreso_mensual ?? 0}`,
            20,
            152
        );
        let riesgoColor: [number, number, number] =
            [22, 163, 74];
        if (
            alerta?.nivel_riesgo === 'alto' ||
            alerta?.nivel_riesgo === 'critico'
        ) {
            riesgoColor = [220, 38, 38];
        }
        else if (
            alerta?.nivel_riesgo === 'medio'
        ) {
            riesgoColor = [245, 158, 11];
        }
        doc.setFillColor(
            riesgoColor[0],
            riesgoColor[1],
            riesgoColor[2]
        );
        doc.roundedRect(
            14,
            170,
            182,
            40,
            4,
            4,
            'F'
        );
        doc.setTextColor(255);
        doc.setFontSize(16);
        doc.text(
            `RIESGO ${(alerta?.nivel_riesgo ?? 'sin_riesgo').toUpperCase()}`,
            20,
            190
        );
        doc.setFontSize(24);
        doc.text(
            `${porcentaje.toFixed(0)}%`,
            150,
            190
        );
        doc.setTextColor(0);
        let estadoCaso =
            'Sin atención institucional';
        if (
            intervenciones.length > 0 &&
            intervenciones.length < 3
        ) {
            estadoCaso =
                'En seguimiento';
        }
        if (
            intervenciones.length >= 3
        ) {
            estadoCaso =
                'Atención activa';
        }
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            220,
            182,
            35,
            4,
            4,
            'F'
        );
        doc.setFontSize(13);
        doc.text(
            'Estado del Caso',
            20,
            235
        );
        doc.setFontSize(11);
        doc.text(
            estadoCaso,
            20,
            247
        );
        let prioridad =
            'Baja';
        if (
            alerta?.nivel_riesgo === 'medio'
        ) {
            prioridad =
                'Media';
        }
        if (
            alerta?.nivel_riesgo === 'alto'
        ) {
            prioridad =
                'Alta';
        }
        if (
            alerta?.nivel_riesgo === 'critico'
        ) {
            prioridad =
                'Urgente';
        }
        doc.setFontSize(11);
        doc.text(
            `Prioridad Institucional: ${prioridad}`,
            120,
            247
        );
        /*
        ANÁLISIS DEL CASO
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Análisis del Caso'
        );
        doc.setFontSize(20);
        doc.text(
            'Análisis del Caso',
            14,
            35
        );
        const factoresPrincipales =
            alerta?.factores_principales ?? [];
        const factorPrincipal =
            factoresPrincipales[0] ??
            'No determinado';
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            50,
            182,
            170,
            4,
            4,
            'F'
        );
        const interpretacion = `
El principal factor identificado corresponde a ${factorPrincipal}.
El estudiante presenta una probabilidad estimada de abandono escolar del ${porcentaje.toFixed(0)}% y se encuentra clasificado con riesgo ${(alerta?.nivel_riesgo ?? '').toUpperCase()}.
Actualmente se registran ${factoresPrincipales.length} factores de riesgo relevantes asociados al caso.
El estado institucional registrado corresponde a "${estadoCaso}" con una prioridad de atención ${prioridad.toUpperCase()}.
La evidencia disponible indica la necesidad de mantener seguimiento académico, familiar y socioeducativo de manera permanente para reducir la probabilidad de abandono escolar.
`;
        const lineas =
            doc.splitTextToSize(
                interpretacion.trim(),
                135
            );
        doc.setFontSize(12);
        doc.text(
            lineas,
            25,
            65
        );
        const recomendaciones: string[] = [];
        if (
            alerta?.nivel_riesgo === 'critico'
        ) {
            recomendaciones.push(
                'Implementar seguimiento institucional inmediato con prioridad alta.'
            );
        }
        if (
            alerta?.nivel_riesgo === 'alto'
        ) {
            recomendaciones.push(
                'Mantener seguimiento semanal hasta evidenciar reducción del riesgo.'
            );
        }
        if (
            factoresPrincipales.includes(
                'Materias reprobadas'
            )
        ) {
            recomendaciones.push(
                'Aplicar plan de recuperación académica y refuerzo pedagógico.'
            );
        }
        if (
            factoresPrincipales.includes(
                'Baja asistencia'
            )
        ) {
            recomendaciones.push(
                'Monitorear asistencia diariamente y coordinar acciones con el representante.'
            );
        }
        if (
            factoresPrincipales.includes(
                'Sin acceso a internet'
            )
        ) {
            recomendaciones.push(
                'Evaluar mecanismos institucionales de apoyo tecnológico.'
            );
        }
        if (
            factoresPrincipales.includes(
                'Violencia intrafamiliar'
            )
        ) {
            recomendaciones.push(
                'Coordinar valoración y seguimiento con trabajo social y orientación.'
            );
        }
        if (
            intervenciones.length === 0
        ) {
            recomendaciones.push(
                'Registrar una intervención institucional en el corto plazo.'
            );
        }
        recomendaciones.push(
            'Mantener monitoreo continuo mediante SIADE.'
        );
        doc.setFillColor(
            36,
            83,
            138
        );
        doc.roundedRect(
            14,
            235,
            182,
            30,
            4,
            4,
            'F'
        );
        doc.setTextColor(255);
        doc.setFontSize(13);
        doc.text(
            `RIESGO ${(alerta?.nivel_riesgo ?? '').toUpperCase()}  •  FACTORES ${factoresPrincipales.length}  •  PRIORIDAD ${prioridad.toUpperCase()}`,
            20,
            253
        );
        doc.setTextColor(0);
        /*
        PLAN DE ACCIÓN INSTITUCIONAL
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Plan de Acción Institucional'
        );
        doc.setFontSize(20);
        doc.text(
            'Plan de Acción Institucional',
            14,
            35
        );
        /*
          DIAGNÓSTICO
        */
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            14,
            50,
            182,
            95,
            4,
            4,
            'F'
        );
        const diagnostico = `
Nivel de riesgo:
${(alerta?.nivel_riesgo ?? 'sin definir').toUpperCase()}
Probabilidad estimada:
${porcentaje.toFixed(0)}%
Factores identificados:
${factoresPrincipales.length}
Estado actual:
${estadoCaso}
Prioridad institucional:
${prioridad}
`;
        const diagnosticoLineas =
            doc.splitTextToSize(
                diagnostico,
                155
            );
        doc.setFontSize(10);
        doc.text(
            diagnosticoLineas,
            25,
            65
        );
        /*
          ACCIONES RECOMENDADAS
        */
        doc.setFontSize(16);
        doc.text(
            'Acciones Recomendadas',
            14,
            170
        );
        doc.setFontSize(10);
        let yAccion = 185;
        recomendaciones.forEach(
            (recomendacion: string, index: number) => {
                doc.setFillColor(
                    245,
                    247,
                    250
                );
                const lineasRecomendacion =
                    doc.splitTextToSize(
                        `${index + 1}. ${recomendacion}`,
                        160
                    );
                const alturaTarjeta =
                    Math.max(
                        10,
                        lineasRecomendacion.length * 5
                    );
                doc.roundedRect(
                    14,
                    yAccion - 10,
                    182,
                    alturaTarjeta,
                    4,
                    4,
                    'F'
                );
                doc.text(
                    lineasRecomendacion,
                    20,
                    yAccion
                );
                yAccion += alturaTarjeta + 10;
            }
        );
        /*
        RESUMEN EJECUTIVO
        */
        doc.addPage();
        this.addHeader(
            doc,
            'Resumen Ejecutivo'
        );
        doc.setFontSize(20);
        doc.text(
            'Resumen Ejecutivo',
            14,
            35
        );
        const kpiWidth = 80;
        const kpiHeight = 40;
        doc.setFillColor(
            245,
            247,
            250
        );
        doc.roundedRect(
            20,
            55,
            kpiWidth,
            kpiHeight,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            110,
            55,
            kpiWidth,
            kpiHeight,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            20,
            110,
            kpiWidth,
            kpiHeight,
            4,
            4,
            'F'
        );
        doc.roundedRect(
            110,
            110,
            kpiWidth,
            kpiHeight,
            4,
            4,
            'F'
        );
        doc.setFontSize(11);
        doc.text(
            'Nivel de Riesgo',
            30,
            70
        );
        doc.text(
            'Probabilidad',
            120,
            70
        );
        doc.text(
            'Factores',
            30,
            125
        );
        doc.text(
            'Prioridad',
            120,
            125
        );
        doc.setFontSize(18);
        doc.text(
            (alerta?.nivel_riesgo ?? '')
                .toUpperCase(),
            30,
            88
        );
        doc.text(
            `${porcentaje.toFixed(0)}%`,
            120,
            88
        );
        doc.text(
            `${factoresPrincipales.length}`,
            30,
            143
        );
        doc.text(
            prioridad.toUpperCase(),
            120,
            143
        );
        this.addFooter(doc);
        doc.save(
            `estudiante-${estudiante.id_estudiante}.pdf`
        );
    }

    private async loadImageAsBase64(
        path: string
    ): Promise<string> {
        const response =
            await fetch(path);
        const blob =
            await response.blob();
        return new Promise(
            (resolve) => {
                const reader =
                    new FileReader();
                reader.onloadend =
                    () => resolve(
                        reader.result as string
                    );
                reader.readAsDataURL(blob);
            }
        );
    }
}