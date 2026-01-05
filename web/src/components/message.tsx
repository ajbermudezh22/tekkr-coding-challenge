import React from "react";
import {cn} from "../lib/utils";
import Spinner from "./ui/spinner";
import {BotIcon, UserIcon} from "lucide-react";
import Markdown from "react-markdown";
import { ProjectPlan, ProjectPlanPreview } from "./project-plan-preview";

export type Message = { role: "user" | "assistant"; content: string };

export function MessageContainer({ role, children }: React.PropsWithChildren<{ role: Message["role"] }>) {
    return (
        <div className={cn("flex flex-col gap-2", role === "user" ? "items-end" : "items-start")}>
            <div
                className={
                    "flex flex-row items-center gap-1 rounded-full bg-accent py-1.5 pe-3 ps-1.5 text-xs font-semibold"
                }
            >
                {role === "assistant" && <BotIcon className={"me-1 inline-block h-4 w-4"} />}
                {role === "user" && <UserIcon className={"me-1 inline-block h-4 w-4"} />}
                {role === "user" ? "You" : "Assistant"}
            </div>
            <div className={cn(role === "user" ? "pe-2 ps-16" : "flex w-full flex-col items-start pe-16 ps-2")}>
                {children}
            </div>
        </div>
    );
}

export function AssistantLoadingIndicator() {
    return (
        <MessageContainer role={"assistant"}>
            <div
                className={
                    "flex flex-row items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-muted-foreground"
                }
            >
                <Spinner />
                Working on it...
            </div>
        </MessageContainer>
    );
}

export function MessageContent({ content }: { content: string }) {
  // Regex to find <project-plan>...</project-plan>
  // using split to get parts.
  const parts = content.split(/(<project-plan>[\s\S]*?<\/project-plan>)/g);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none w-full">
      {parts.map((part, index) => {
        if (part.startsWith("<project-plan>")) {
          try {
            const jsonStr = part.replace(/<\/?project-plan>/g, "");
            const plan: ProjectPlan = JSON.parse(jsonStr);
            return <ProjectPlanPreview key={index} plan={plan} />;
          } catch (e) {
            console.error(e);
            return <div key={index} className="text-destructive text-xs p-2 border border-destructive rounded">Failed to parse project plan</div>;
          }
        }
        // Render regular text as markdown
        if (!part.trim()) return null;
        return <Markdown key={index}>{part}</Markdown>;
      })}
    </div>
  );
}
