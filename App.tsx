import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Placement, Creative, AnalysisResult, Severity, CreativeSet, FormatGroup, OverallConclusion, ChecklistItem } from './types';
import { PLACEMENTS, META_ADS_GUIDELINES } from './constants';
import { FileUpload } from './components/FileUpload';
import { PlatformSelector as FormatSelector } from './components/PlatformSelector';
import { PlatformAnalysisView } from './components/PlatformAnalysisView';

type View = 'upload' | 'format_selection' | 'format_analysis';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

const getFormatAnalysis = async (creativeSet: CreativeSet, formatGroup: FormatGroup): Promise<AnalysisResult | null> => {
    if (!process.env.API_KEY) {
        return { 
            effectivenessScore: 0,
            effectivenessJustification: "",
            clarityScore: 0,
            clarityJustification: "",
            textToImageRatio: 0,
            textToImageRatioJustification: "",
            funnelStage: "N/A",
            funnelStageJustification: "",
            recommendations: [],
            advantagePlusAnalysis: [],
            placementSummaries: [],
            overallConclusion: { headline: "Error de Configuración", checklist: [{ severity: 'CRITICAL', text: "La API Key de Gemini no está configurada. Por favor, asegúrate de que la variable de entorno API_KEY esté disponible."}] },
        };
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const placementsForFormat = PLACEMENTS.filter(p => p.group === formatGroup);
    const placementListForPrompt = placementsForFormat.map(p => `- ${p.name} (ID: ${p.id}, Aspectos: ${p.aspectRatios.join(', ')})`).join('\n');
    const hasSquare = !!creativeSet.square;
    const hasVertical = !!creativeSet.vertical;
    const relevantCreativeProvided = formatGroup === 'SQUARE_LIKE' ? hasSquare : hasVertical;

    const prompt = `
      **Instrucción Maestra:**
      Actúas como un director de arte y estratega de marketing para Meta Ads, con un ojo extremadamente crítico, amigable y detallista. Tu tarea es realizar un análisis HOLÍSTICO de los creativos del usuario para el grupo de formatos '${formatGroup}'. Debes evaluar CÓMO FUNCIONA EL CREATIVO RELEVANTE (${formatGroup === 'SQUARE_LIKE' ? 'el cuadrado/1:1' : 'el vertical/9:16'}) en TODAS las ubicaciones de este grupo. Tu análisis debe ser específico, accionable y basarse en los creativos y las especificaciones. TODO el texto de tu respuesta debe estar exclusivamente en ESPAÑOL.

      **Creativos Proporcionados:**
      - Creativo Cuadrado (1:1): ${hasSquare ? 'Sí' : 'No'}
      - Creativo Vertical (9:16): ${hasVertical ? 'Sí' : 'No'}
      - Creativo Relevante para este análisis: ${relevantCreativeProvided ? 'Sí' : 'No. ¡Esto es un problema grave!'}
      
      **Ubicaciones a Considerar en tu Análisis para '${formatGroup}':**
      ${placementListForPrompt}

      **TAREAS DE ANÁLISIS OBLIGATORIAS:**

      **1. ANÁLISIS ESTRATÉGICO GLOBAL (PARA ESTE GRUPO DE FORMATOS):**
      - **effectivenessScore, clarityScore, textToImageRatio, funnelStage, recommendations, advantagePlusAnalysis**: Genera estos datos como se te ha indicado anteriormente. La efectividad debe ser BAJA si el creativo relevante no se proporcionó.
      - **justifications (effectivenessJustification, etc.)**: Para cada una de las 4 métricas estratégicas, AÑADE una justificación breve y directa (4-8 palabras) que avale el puntaje. Ejemplos: "Buen contraste, mensaje claro.", "Texto muy pequeño, difícil de leer.", "Ideal para generar reconocimiento de marca."

      **2. RESUMEN CRÍTICO POR UBICACIÓN (LA TAREA MÁS IMPORTANTE):**
      - **placementSummaries**: Un array. Para CADA una de las ubicaciones listadas arriba, realiza un ANÁLISIS VISUAL del creativo relevante. Tu máxima prioridad es detectar si los elementos de la interfaz de Meta TAPAN, OCULTAN o HACEN ILEGIBLE cualquier texto, logo o parte importante del producto.
        - **placementId**: El ID numérico de la ubicación (ej: "0" para FB_FEED).
        - **summary**: Un array de strings. Debe ser una LISTA CORTA de puntos directos y accionables. Sé amigable, específico y prioriza los cambios más urgentes. CITA TEXTOS del anuncio. Por ejemplo: ["¡Funciona muy bien! El formato 1:1 es nativo.", "CRÍTICO: El texto 'SUPPORT YOUR NERVOUS SYSTEM' queda completamente tapado por la interfaz. Debes subirlo.", "El logo 'MUTO' en la parte inferior es casi ilegible, considera agrandarlo."]

      **3. CONCLUSIÓN FINAL Y PRÓXIMOS PASOS:**
      - **overallConclusion**: Un objeto con 'headline' y 'checklist' (ya definido).

      **Formato de Salida Obligatorio (JSON ÚNICAMENTE):**
      Debes responder con un único objeto JSON. TODO el texto debe estar en ESPAÑOL.

      --- DOCUMENTO DE ESPECIFICACIONES (META ADS Y ADVANTAGE+) ---
      ${META_ADS_GUIDELINES}
      --- FIN DEL DOCUMENTO ---
    `;
    
    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            effectivenessScore: { type: Type.NUMBER },
            effectivenessJustification: { type: Type.STRING },
            clarityScore: { type: Type.NUMBER },
            clarityJustification: { type: Type.STRING },
            textToImageRatio: { type: Type.NUMBER },
            textToImageRatioJustification: { type: Type.STRING },
            funnelStage: { type: Type.STRING, enum: ['TOFU', 'MOFU', 'BOFU'] },
            funnelStageJustification: { type: Type.STRING },
            recommendations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        severity: { type: Type.STRING, enum: Object.values(Severity) },
                        message: { type: Type.STRING },
                    },
                    required: ['severity', 'message'],
                },
            },
            advantagePlusAnalysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        enhancement: { type: Type.STRING },
                        applicable: { type: Type.STRING, enum: ['ACTIVATE', 'CAUTION'] },
                        justification: { type: Type.STRING },
                    },
                    required: ['enhancement', 'applicable', 'justification'],
                },
            },
            placementSummaries: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        placementId: { type: Type.STRING },
                        summary: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['placementId', 'summary'],
                }
            },
            overallConclusion: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    checklist: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING, enum: ['CRITICAL', 'ACTIONABLE', 'POSITIVE'] },
                                text: { type: Type.STRING },
                            },
                            required: ['severity', 'text'],
                        } 
                    },
                },
                required: ['headline', 'checklist'],
            }
        },
        required: [
            'effectivenessScore', 'effectivenessJustification', 
            'clarityScore', 'clarityJustification',
            'textToImageRatio', 'textToImageRatioJustification',
            'funnelStage', 'funnelStageJustification',
            'recommendations', 'advantagePlusAnalysis', 'placementSummaries', 'overallConclusion'
        ],
    };

    try {
        const parts: ({ text: string; } | { inlineData: { data: string; mimeType: string; }; })[] = [{ text: prompt }];
        const relevantCreative = formatGroup === 'SQUARE_LIKE' ? creativeSet.square : creativeSet.vertical;
        if(relevantCreative) {
            parts.push(await fileToGenerativePart(relevantCreative.file));
        } else if (formatGroup === 'SQUARE_LIKE' && creativeSet.vertical) {
             parts.push(await fileToGenerativePart(creativeSet.vertical.file));
        } else if (formatGroup === 'VERTICAL' && creativeSet.square) {
            parts.push(await fileToGenerativePart(creativeSet.square.file));
        }

        if (parts.length === 1) { 
             return {
                effectivenessScore: 0, effectivenessJustification: "", clarityScore: 0, clarityJustification: "", textToImageRatio: 0, textToImageRatioJustification: "", funnelStage: "N/A", funnelStageJustification: "", recommendations: [], advantagePlusAnalysis: [], placementSummaries: [],
                overallConclusion: { headline: "Error", checklist: [{ severity: 'CRITICAL', text: "No se proporcionaron creativos para el análisis." }] },
            };
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Error fetching or parsing Gemini recommendations:", error);
        let errorMessage = "Hubo un error al generar las recomendaciones.";
        if (error instanceof Error && (error.message.includes('400') || error.message.includes('500'))) {
             errorMessage = "El creativo no pudo ser procesado. Puede ser demasiado grande o tener un formato no compatible. Intenta con un archivo más pequeño.";
        }
        return {
            effectivenessScore: 0, effectivenessJustification: "", clarityScore: 0, clarityJustification: "", textToImageRatio: 0, textToImageRatioJustification: "", funnelStage: "Error", funnelStageJustification: "", recommendations: [], advantagePlusAnalysis: [], placementSummaries: [],
            overallConclusion: { headline: "Error de Análisis", checklist: [{ severity: 'CRITICAL', text: errorMessage }] },
        };
    }
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('upload');
    const [creativeSet, setCreativeSet] = useState<CreativeSet>({ square: null, vertical: null });
    const [selectedFormatGroup, setSelectedFormatGroup] = useState<FormatGroup | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const hasAnyCreative = creativeSet.square || creativeSet.vertical;

    useEffect(() => {
        const squareUrl = creativeSet.square?.url;
        const verticalUrl = creativeSet.vertical?.url;
        return () => {
            if (squareUrl) URL.revokeObjectURL(squareUrl);
            if (verticalUrl) URL.revokeObjectURL(verticalUrl);
        };
    }, [creativeSet]);
    
    const handleFileUpload = (files: { square?: File; vertical?: File }) => {
        const newCreativeSet: CreativeSet = { square: null, vertical: null };
        let filesToProcess = (files.square ? 1 : 0) + (files.vertical ? 1 : 0);

        if (filesToProcess === 0) return;
        
        const currentSquare = creativeSet.square;
        const currentVertical = creativeSet.vertical;

        const onFileProcessed = () => {
            filesToProcess--;
            if (filesToProcess === 0) {
                 const finalCreativeSet = {
                    square: newCreativeSet.square || currentSquare,
                    vertical: newCreativeSet.vertical || currentVertical,
                 }
                 setCreativeSet(finalCreativeSet);
                 setView('format_selection');
            }
        };

        const processFile = (file: File, format: 'square' | 'vertical') => {
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('image/') ? 'image' : 'video';

            const setCreative = (width: number, height: number) => {
                 newCreativeSet[format] = { file, url, type, width, height, format };
                 onFileProcessed();
            }

            if (type === 'image') {
                const img = new Image();
                img.onload = () => setCreative(img.width, img.height);
                img.onerror = () => { console.error(`Error loading ${format} image`); URL.revokeObjectURL(url); onFileProcessed(); }
                img.src = url;
            } else {
                const video = document.createElement('video');
                video.onloadedmetadata = () => setCreative(video.videoWidth, video.videoHeight);
                video.onerror = () => { console.error(`Error loading ${format} video`); URL.revokeObjectURL(url); onFileProcessed(); }
                video.src = url;
            }
        };
        
        if (view !== 'upload') {
            handleReset();
        }
        
        if (files.square) processFile(files.square, 'square');
        if (files.vertical) processFile(files.vertical, 'vertical');
    };

    const handleFormatSelect = useCallback(async (format: FormatGroup) => {
        if (!creativeSet.square && !creativeSet.vertical) {
            console.warn("No creatives available for analysis.");
            return;
        }
        setSelectedFormatGroup(format);
        setView('format_analysis');
        setIsLoading(true);
        setAnalysisResult(null);
        const result = await getFormatAnalysis(creativeSet, format);
        setAnalysisResult(result);
        setIsLoading(false);
    }, [creativeSet]);
    
    const handleGoBack = () => {
        setView('format_selection');
        setSelectedFormatGroup(null);
        setAnalysisResult(null);
    };

    const handleReset = () => {
        setCreativeSet({ square: null, vertical: null });
        setSelectedFormatGroup(null);
        setAnalysisResult(null);
        setIsLoading(false);
        setView('upload');
    };

    return (
        <div className="min-h-screen text-brand-text p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">Meta Ads Creative Assistant</h1>
                <p className="mt-4 text-lg text-brand-text-secondary">
                  {view === 'upload' && 'Sube tus creativos (cuadrado y/o vertical) para empezar.'}
                  {view === 'format_selection' && 'Tus creativos están listos. Elige un grupo de formatos para analizar.'}
                  {view === 'format_analysis' && `Análisis para Formatos ${selectedFormatGroup === 'SQUARE_LIKE' ? 'Cuadrados y Rectangulares' : 'Verticales'}`}
                </p>
                {hasAnyCreative && (
                    <div className="mt-6">
                        <button
                            onClick={handleReset}
                            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2 mx-auto"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
                            </svg>
                            Cargar Nuevos Creativos
                        </button>
                    </div>
                )}
            </header>

            <main>
                {view === 'upload' && (
                     <div className="max-w-4xl mx-auto">
                        <FileUpload onFileUpload={handleFileUpload} />
                    </div>
                )}
                
                {view === 'format_selection' && hasAnyCreative && (
                    <FormatSelector onSelectFormat={handleFormatSelect} />
                )}

                {view === 'format_analysis' && selectedFormatGroup && (
                     <PlatformAnalysisView
                        formatGroup={selectedFormatGroup}
                        analysisResult={analysisResult}
                        isLoading={isLoading}
                        onGoBack={handleGoBack}
                        creativeSet={creativeSet}
                     />
                )}
            </main>
        </div>
    );
};

export default App;