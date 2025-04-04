export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        // <AuthSplitLayout title={title} description={description} {...props}>
        //     {children}
        // </AuthSplitLayout>\
        <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-t from-[#c9ccdf] to-[#d6e1eb]">
            <div className="mx-auto grid h-[calc(100vh-4rem] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:w-[calc(100vw-4rem] md:grid-cols-3">
                <div className="col-span-2 hidden h-full w-full items-center justify-center bg-gradient-to-t from-[#35aecd] to-[#3e4a93] md:flex">
                    <img src="/images/login-image.png" alt="login image" />
                </div>
                <div className="flex w-full items-center justify-center bg-white">{children}</div>
            </div>
        </div>
    );
}
