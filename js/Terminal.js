export class Terminal {
    constructor(element) {
        this.element = element;
        this.maxLines = 60;
    }

    log(text, type = "info") {
        const line = document.createElement("div");
        line.className = "terminal-line";

        let prefix = "[LOG_INFO]";
        switch (type) {
            case "system_init": prefix = "[SYS_BOOT]"; break;
            case "data_spawn": prefix = "[DATA_FRAG]"; break;
            case "gsap_spawn": prefix = "[GSAP_SIGNAL]"; break;
            case "webflow_spawn": prefix = "[WF_CONSTRUCT]"; break;
            case "food_eat_pixel": prefix = "[DATA_INTAKE]"; break;
            case "gsap_eat": prefix = "[GSAP_MODULE]"; break;
            case "webflow_eat": prefix = "[WF_SCHEMA]"; break;
            case "level_up": prefix = "[CORE_EVOLVE]"; break;
            case "pause": prefix = "[CHRONO_SUSPEND]"; break;
            case "resume": prefix = "[CHRONO_RESUME]"; break;
            case "audio_on": prefix = "[AUDIO_SYS_ON]"; break;
            case "audio_off": prefix = "[AUDIO_SYS_OFF]"; break;
            case "settings": prefix = "[SYS_CONFIG]"; break;
            case "fatal_error": prefix = "[KERNEL_PANIC_0xDEADCODE]"; break;
        }

        let styledText = text;
        // Formatting logic moved from script.js
        if (type === "fatal_error")
            styledText = `//_! ${text.toUpperCase().replace(/\s/g, "_")} !// :: GSAP_TIMELINE_HALTED :: PHYSICS2D_VECTOR_NULL`;
        if (type === "level_up")
            styledText = `//** ${text.replace(/\s/g, "_")} :: GSAP_PHYSICS2D_RECALIBRATING_FORCES **//`;
        if (type === "gsap_eat") {
            const parts = text.split("::");
            if (parts[1]) styledText = `:: GSAP_Physics2D_VELOCITY_AUGMENTED (${parts[1].trim()}) :: GSAP_MotionPath_Plugin_Simulating_New_Trajectory`;
        }
        if (type === "webflow_eat") {
            const parts = text.split("::");
            if (parts[1]) styledText = `:: Webflow_COMPONENT_STRUCTURE_FORTIFIED (${parts[1].trim()}) :: WF_Grid_Adaptive_Recalculation`;
        }
        if (type === "data_spawn" && text.includes("Coords"))
            styledText = `Acquiring_Target_Lock_On_Data_Fragment :: ${text} :: WF_Grid_Scan_Complete`;
        if (type === "settings" && text.includes("Temporal_Flow"))
            styledText = `GSAP_TimeScale_Modulation_Engaged :: ${text}`;
        if (type === "settings" && text.includes("WF-Grid_Density"))
            styledText = `Webflow_Layout_Engine_Responsive_Recalculation :: ${text}`;
        if (type === "settings" && text.includes("Kinetic_Impulse"))
            styledText = `GSAP_PhysicsProps_Plugin_Impact_Force_Set :: ${text}`;

        line.textContent = `${prefix} :: ${styledText}`;

        // Add before typing line
        const typingLine = this.element.querySelector(".typing");
        if (typingLine) typingLine.classList.remove("typing");
        this.element.appendChild(line);

        const newTypingLine = document.createElement("div");
        newTypingLine.className = "terminal-line typing";
        this.element.appendChild(newTypingLine);

        this.element.scrollTop = this.element.scrollHeight;

        // Cleanup old lines
        const lines = this.element.querySelectorAll(".terminal-line:not(.typing)");
        if (lines.length > this.maxLines) lines[0].remove();
    }
}
