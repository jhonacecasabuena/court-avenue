export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <img
                src="/header.png"
                alt="Court Avenue"
                className="h-6 w-auto object-contain"
            />

            <div className="grid min-w-0 text-left">
                <span className="truncate text-sm font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Court Avenue
                </span>

                <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-[#b91c1c]">
                    Admin Panel
                </span>
            </div>
        </div>
    );
}
