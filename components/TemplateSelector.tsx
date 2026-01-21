"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTemplates, useUseTemplate } from "@/hooks/use-templates";
import { TemplateAccount } from "@/types/template";
import { siteConfig } from "@/config/site";

export function TemplateSelector() {
    const router = useRouter();
    const workspaceId = "luminous-glow";

    const { data: templates, isLoading, error } = useTemplates();
    const { mutate: performUseTemplate, isPending: isUsingTemplate } = useUseTemplate();
    const [loadingTemplateId, setLoadingTemplateId] = useState<number | null>(null);

    const handleUseTemplate = (template?: TemplateAccount) => {
        const payload = template ? { template_id: template.id } : {};

        if (template) {
            setLoadingTemplateId(template.id);
        }

        performUseTemplate(payload, {
            onSuccess: () => {
                router.push(`/builder/${workspaceId}`);
            },
            onError: (error) => {
                console.error("Failed to use template:", error);
                alert("Failed to setup template. Please try again.");
                setLoadingTemplateId(null);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100 italic text-red-600">
                Failed to load templates. Please check your connection.
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {templates?.map((template) => (
                    <div
                        key={template.id}
                        className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                            {template.template_image ? (
                                <Image
                                    src={template.template_image.startsWith('http') ? template.template_image : `${siteConfig.apiUrl}${template.template_image}`}
                                    alt={template.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    No image available
                                </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col grow bg-white">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                {template.name}
                            </h3>
                            <p className="text-slate-600 mb-6 grow">
                                {template.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-3 mt-auto">
                                <a
                                    href={template.preview_url || "#"}
                                    target={template.preview_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium transition-colors ${!template.preview_url ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 hover:border-slate-300"}`}
                                    onClick={(e) => {
                                        if (!template.preview_url) {
                                            e.preventDefault();
                                        }
                                        e.stopPropagation();
                                    }}
                                >
                                    Preview
                                </a>

                                <button
                                    onClick={() => handleUseTemplate(template)}
                                    disabled={isUsingTemplate}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    {loadingTemplateId === template.id ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Setting up...
                                        </>
                                    ) : (
                                        <>
                                            Use Template
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Existing Fallback/Direct Link */}
            <div className="flex justify-center mt-12">
                <button
                    onClick={() => handleUseTemplate()}
                    disabled={isUsingTemplate}
                    className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-2 group disabled:opacity-50 cursor-pointer"
                >
                    Or continue without a template
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    );
}

