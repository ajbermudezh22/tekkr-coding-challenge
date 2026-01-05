import React, { useState } from "react";
import { ChevronDown, ChevronRight, Briefcase, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

export interface ProjectPlan {
  workstreams: {
    title: string;
    description: string;
    deliverables: {
      title: string;
      description: string;
    }[];
  }[];
}

export function ProjectPlanPreview({ plan }: { plan: ProjectPlan }) {
  if (!plan || !plan.workstreams) return null;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm my-4 overflow-hidden">
      <div className="bg-muted/50 p-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Project Plan
        </h3>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {plan.workstreams.map((workstream, idx) => (
          <WorkstreamItem key={idx} workstream={workstream} />
        ))}
      </div>
    </div>
  );
}

function WorkstreamItem({ workstream }: { workstream: ProjectPlan["workstreams"][0] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex flex-col gap-1">
          <div className="font-medium">{workstream.title}</div>
          <div className="text-sm text-muted-foreground">{workstream.description}</div>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      
      {isOpen && (
        <div className="p-3 pt-0 flex flex-col gap-2 pl-6 border-t bg-muted/10">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">Deliverables</div>
            {workstream.deliverables.map((deliverable, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm bg-background p-2 rounded border">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex flex-col">
                        <span className="font-medium">{deliverable.title}</span>
                        <span className="text-muted-foreground text-xs">{deliverable.description}</span>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}



