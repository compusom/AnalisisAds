import React, { useState } from 'react';
import { AnalysisResult, Severity, AdvantagePlusRecommendation } from '../types';

const severityConfig = {
    [Severity.CRITICAL]: {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ),
        bgColor: 'bg-red-500/10',
    },
    [Severity.RECOMMENDED]: {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" />
            </svg>
        ),
        bgColor: 'bg-blue-500/10',
    },
    [Severity.GOOD_TO_KNOW]: {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        bgColor: 'bg-green-500/10',
    },
};

const advantageIcons = {
    ACTIVATE: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
    CAUTION: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
};

const ScoreCircle = ({ score, label, colorClass, justification }: { score: number; label: string; colorClass: string, justification: string }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-between p-3 bg-brand-border/50 rounded-lg text-center h-full">
            <div>
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-brand-surface" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                    <circle
                        className={colorClass}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <span className="text-xl font-bold -mt-16">{score}<span className="text-sm">%</span></span>
                <span className="block mt-12 text-xs font-medium text-brand-text-secondary uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-xs text-brand-text-secondary mt-2">{justification}</p>
        </div>
    );
};

const TextRatioIndicator = ({ score, justification }: { score: number, justification: string }) => {
    let colorClass = 'text-green-400';
    let icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    if (score > 35) {
        colorClass = 'text-red-400';
        icon = (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    } else if (score > 20) {
        colorClass = 'text-yellow-400';
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-between p-3 bg-brand-border/50 rounded-lg text-center h-full">
            <div>
                {icon}
                <p className={`text-lg font-bold ${colorClass}`}>{score}%</p>
                <span className="text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Texto en Imagen</span>
            </div>
            <p className="text-xs text-brand-text-secondary mt-2">{justification}</p>
        </div>
    );
};

const FunnelStageCard = ({ stage, justification }: { stage: string, justification: string }) => (
    <div className="flex flex-col items-center justify-between p-3 bg-brand-border/50 rounded-lg text-center h-full">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <p className="text-lg font-bold">{stage}</p>
            <span className="text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Etapa del Embudo</span>
        </div>
        <p className="text-xs text-brand-text-secondary mt-2">{justification}</p>
    </div>
);


const AdvantagePlusItem: React.FC<{ item: AdvantagePlusRecommendation }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isCaution = item.applicable === 'CAUTION';

    return (
        <div className={`rounded-md ${isCaution ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
            <button
                className="flex items-center w-full text-left gap-3 p-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-shrink-0">{advantageIcons[item.applicable]}</div>
                <p className={`flex-1 font-semibold ${isCaution ? 'text-yellow-300' : 'text-green-300'}`}>{item.enhancement}</p>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-brand-text-secondary transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="px-3 pb-3 pl-11">
                    <p className="text-brand-text-secondary text-sm">{item.justification}</p>
                </div>
            )}
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-40 bg-brand-border rounded-lg"></div>
            <div className="h-40 bg-brand-border rounded-lg"></div>
            <div className="h-40 bg-brand-border rounded-lg"></div>
            <div className="h-40 bg-brand-border rounded-lg"></div>
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-border">
             <div className="h-5 bg-brand-border rounded w-1/3 mb-4"></div>
             {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-brand-border/50 rounded-md">
                    <div className="w-5 h-5 bg-brand-border rounded-full mt-1"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-brand-border rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-border">
             <div className="h-5 bg-brand-border rounded w-1/3 mb-4"></div>
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-brand-border/50 rounded-md">
                    <div className="w-5 h-5 bg-brand-border rounded-full mt-1"></div>
                    <div className="flex-1 space-y-2">
                         <div className="h-4 bg-brand-border rounded w-1/4"></div>
                        <div className="h-3 bg-brand-border rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const Recommendations: React.FC<{ analysisResult: AnalysisResult | null; isLoading: boolean; }> = ({ analysisResult, isLoading }) => {
    return (
        <div className="bg-brand-surface rounded-lg p-6 shadow-lg min-h-[200px]">
            <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Análisis Estratégico de IA
            </h2>
            {isLoading && <LoadingSkeleton />}
            {analysisResult && !isLoading && (
                 <div className="space-y-8">
                    {/* --- Strategic Overview --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ScoreCircle score={analysisResult.effectivenessScore} label="Efectividad" colorClass="text-green-400" justification={analysisResult.effectivenessJustification} />
                        <ScoreCircle score={analysisResult.clarityScore} label="Claridad" colorClass="text-blue-400" justification={analysisResult.clarityJustification} />
                        <TextRatioIndicator score={analysisResult.textToImageRatio} justification={analysisResult.textToImageRatioJustification} />
                        <FunnelStageCard stage={analysisResult.funnelStage} justification={analysisResult.funnelStageJustification} />
                    </div>

                    {/* --- Key Recommendations --- */}
                    <div>
                         <h3 className="text-lg font-semibold text-brand-text mb-3">Recomendaciones Clave</h3>
                         <div className="space-y-3">
                            {analysisResult.recommendations.map((item, index) => {
                                const config = severityConfig[item.severity];
                                return (
                                    <div key={index} className={`flex items-start gap-3 p-3 rounded-md ${config.bgColor}`}>
                                        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
                                        <p className="text-brand-text-secondary text-sm">{item.message}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* --- Advantage+ Analysis --- */}
                    <div className="pt-6 border-t border-brand-border">
                        <h3 className="text-lg font-semibold text-brand-text mb-3">Análisis de Mejoras Advantage+</h3>
                        <div className="space-y-3">
                            {analysisResult.advantagePlusAnalysis.map((item, index) => (
                                <AdvantagePlusItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};