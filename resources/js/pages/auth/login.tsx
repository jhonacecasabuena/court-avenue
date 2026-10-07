import { toast } from "sonner";
import { Form, Head } from "@inertiajs/react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import PasskeyVerify from "@/components/passkey-verify";
import TextLink from "@/components/text-link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in | Court Avenue" />

            {/* Status message */}
            {status && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={["password"]}
                onSuccess={() => {
                    toast.success("Welcome back!", {
                        description: "You have successfully logged in.",
                    });
                }}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Email address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Password
                                </Label>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        tabIndex={5}
                                        className="text-sm font-medium text-[#b91c1c] hover:text-red-800"
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="border-gray-300 data-[state=checked]:border-[#b91c1c] data-[state=checked]:bg-white"
                            />

                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm text-gray-600"
                            >
                                Remember me
                            </Label>
                        </div>

                        {/* Login button */}
                        <Button
                            type="submit"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                            className="h-12 w-full rounded-xl bg-[#b91c1c] text-sm font-bold text-white shadow-lg shadow-red-900/15 transition-all hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/20"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Log in to Court Avenue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </>
                )}
            </Form>

            {/* Register */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <TextLink
                    href={register()}
                    tabIndex={6}
                    className="font-semibold text-[#b91c1c] hover:text-red-800"
                >
                    Create an account
                </TextLink>
            </div>
        </>
    );
}

Login.layout = {
    title: "Welcome back",
    description:
        "Log in to your Court Avenue account and get back on the court.",
};

// import { Form, Head } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import { register } from '@/routes';
// import { store } from '@/routes/login';
// import { request } from '@/routes/password';
// import PasskeyVerify from '@/components/passkey-verify';

// type Props = {
//     status?: string;
//     canResetPassword: boolean;
// };

// export default function Login({ status, canResetPassword }: Props) {
//     return (
//         <>
//             <Head title="Log in" />

//             <PasskeyVerify />

//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password']}
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Email address</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     required
//                                     autoFocus
//                                     tabIndex={1}
//                                     autoComplete="email"
//                                     placeholder="email@example.com"
//                                 />
//                                 <InputError message={errors.email} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label htmlFor="password">Password</Label>
//                                     {canResetPassword && (
//                                         <TextLink
//                                             href={request()}
//                                             className="ml-auto text-sm"
//                                             tabIndex={5}
//                                         >
//                                             Forgot your password?
//                                         </TextLink>
//                                     )}
//                                 </div>
//                                 <PasswordInput
//                                     id="password"
//                                     name="password"
//                                     required
//                                     tabIndex={2}
//                                     autoComplete="current-password"
//                                     placeholder="Password"
//                                 />
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="flex items-center space-x-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     tabIndex={3}
//                                 />
//                                 <Label htmlFor="remember">Remember me</Label>
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="mt-4 w-full"
//                                 tabIndex={4}
//                                 disabled={processing}
//                                 data-test="login-button"
//                             >
//                                 {processing && <Spinner />}
//                                 Log in
//                             </Button>
//                         </div>

//                         <div className="text-center text-sm text-muted-foreground">
//                             Don't have an account?{' '}
//                             <TextLink href={register()} tabIndex={5}>
//                                 Sign up
//                             </TextLink>
//                         </div>
//                     </>
//                 )}
//             </Form>

//             {status && (
//                 <div className="mb-4 text-center text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}
//         </>
//     );
// }

// Login.layout = {
//     title: 'Log in to your account',
//     description: 'Enter your email and password below to log in',
// };
