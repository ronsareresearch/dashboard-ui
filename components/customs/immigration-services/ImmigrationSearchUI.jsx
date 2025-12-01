"use client";
import React, { useState } from "react";
import { Search, FileText, Layers } from "lucide-react";
import { SlidersHorizontal, Calendar, Filter, SortAsc } from "lucide-react";

export default function ImmigrationFormsTable() {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        type: "",
        year: "",
    });

    const [text, setText] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [year, setYear] = useState("");
    const [sort, setSort] = useState("Newest");

    const [query, setQuery] = useState(""); // updates only when clicking search

    const forms = [
        {
            code: "I-9",
            name: "Employment Eligibility Verification",
            category: "Employment",
            type: "Verification",
            year: "2024",
            desc: "Verify identity and employment authorization.",
        },
        {
            code: "I-130",
            name: "Petition for Alien Relative",
            category: "Family",
            type: "Petition",
            year: "2023",
            desc: "Establish family relationship for immigration.",
        },
        {
            code: "I-485",
            name: "Adjustment of Status",
            category: "Green Card",
            type: "Adjustment",
            year: "2024",
            desc: "Apply for permanent residence inside the U.S.",
        },
        {
            code: "N-400",
            name: "Application for Naturalization",
            category: "Citizenship",
            type: "Application",
            year: "2024",
            desc: "Apply to become a citizen.",
        },
        {
            code: "I-765",
            name: "Application for Work Authorization",
            category: "Employment",
            type: "Employment",
            year: "2025",
            desc: "Apply for an EAD work permit.",
        },
        {
            code: "I-131",
            name: "Travel Document / Advance Parole",
            category: "Travel",
            type: "Travel",
            year: "2023",
            desc: "Request permission to travel while pending status.",
        },
        {
            code: "I-140",
            name: "Immigrant Petition for Alien Worker",
            category: "Employment",
            type: "Petition",
            year: "2024",
            desc: "Employer petitions for a foreign worker to obtain a green card.",
        },
        {
            code: "I-821",
            name: "Application for Temporary Protected Status (TPS)",
            category: "Humanitarian",
            type: "Application",
            year: "2025",
            desc: "Request temporary legal status in the U.S. due to unsafe conditions in home country.",
        },
        {
            code: "I-90",
            name: "Application to Replace Permanent Resident Card",
            category: "Green Card",
            type: "Application",
            year: "2024",
            desc: "Replace or renew an existing green card.",
        },
        {
            code: "DS-260",
            name: "Immigrant Visa Application",
            category: "Visa",
            type: "Application",
            year: "2023",
            desc: "Apply for an immigrant visa at a U.S. consulate abroad.",
        },
        {
            code: "I-601",
            name: "Application for Waiver of Grounds of Inadmissibility",
            category: "Waiver",
            type: "Application",
            year: "2025",
            desc: "Request a waiver for certain immigration inadmissibility issues.",
        },
    ];


    const filtered = forms.filter((x) => {
        const matchQuery =
            x.code.toLowerCase().includes(query.toLowerCase()) ||
            x.name.toLowerCase().includes(query.toLowerCase());

        const matchCategory = filters.category ? x.category === filters.category : true;
        const matchType = filters.type ? x.type === filters.type : true;
        const matchYear = filters.year ? x.year === filters.year : true;

        return matchQuery && matchCategory && matchType && matchYear;
    });

    return (
        <div className="w-full mx-auto bg-white rounded-2xl">

            <div className="w-full mt-2 space-y-3 p-2">

                <div className="w-full flex flex-wrap items-center justify-between gap-3 p-2 bg-white">

                    {/* === Full-Width Search Input === */}
                    <div className="flex items-center w-full md:flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search forms..."
                            className="ml-2 w-full text-sm outline-none bg-transparent"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {/* === Right-Side Filter Buttons === */}
                    <div className="flex flex-wrap gap-3 items-center justify-end w-full md:w-auto">

                        {/* Category */}
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
                            <Layers className="w-4 h-4 text-gray-600" />
                            Category: <span className="font-semibold">{category || "All"}</span>
                        </button>

                        {/* Type */}
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
                            <Filter className="w-4 h-4 text-gray-600" />
                            Type: <span className="font-semibold">{type || "All"}</span>
                        </button>

                        {/* Year */}
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            Year: <span className="font-semibold">{year || "Any"}</span>
                        </button>

                        {/* Sort */}
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
                            <SortAsc className="w-4 h-4 text-gray-600" />
                            Sort: <span className="font-semibold">{sort}</span>
                        </button>

                        {/* More */}
                        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
                            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                            More
                        </button>

                        {/* Search Button */}
                        <button className="px-6 py-3 rounded-xl text-white font-medium bg-linear-to-r from-purple-500 to-purple-600 shadow-md hover:opacity-90 transition">
                            Search
                        </button>
                    </div>
                </div>


                {/* === Optional Popular Search Row === */}
                <div className="text-sm text-gray-600 px-4">
                    Popular search:{" "}
                    <span className="inline-flex gap-2">
                        <span className="px-3 py-1 border border-gray-200 rounded-lg shadow-sm bg-white">I-9 form</span>
                        <span className="px-3 py-1 border border-gray-200 rounded-lg shadow-sm bg-white">I-130 form</span>
                        <span className="px-3 py-1 border border-gray-200 rounded-lg shadow-sm bg-white">I-131 form</span>
                    </span>
                </div>
            </div>

            <div className="p-2 mt-2">
                {/* === Modern Table === */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-5 bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3 border-b">
                        <div>Form No.</div>
                        <div>Form Name</div>
                        <div>Category</div>
                        <div>Description</div>
                        <div className="text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {filtered.map((form, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-5 px-6 py-4 border-b hover:bg-gray-50 transition"
                        >
                            <div className="font-semibold text-gray-900">{form.code}</div>

                            <div className="text-gray-800">{form.name}</div>

                            <div>
                                <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-xl text-xs">
                                    {form.category}
                                </span>
                            </div>

                            <div className="text-gray-600 text-sm">{form.desc}</div>

                            <div className="flex justify-end">
                                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                                    <FileText className="w-4 h-4" />
                                    View
                                </button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No forms found.
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
