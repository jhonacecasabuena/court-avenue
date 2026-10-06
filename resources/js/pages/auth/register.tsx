import { Form, Head } from "@inertiajs/react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { login } from "@/routes";
import { store } from "@/routes/register";

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Create an account | Court Avenue" />

            <Form
                {...store.form()}
                resetOnSuccess={["password", "password_confirmation"]}
                disableWhileProcessing
                className="space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Full name
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Enter your full name"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>

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
                                tabIndex={2}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Password
                            </Label>

                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                placeholder="Create a password"
                                passwordrules={passwordRules}
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Confirm password
                            </Label>

                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                passwordrules={passwordRules}
                                className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-950 placeholder:text-gray-400 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Create account */}
                        <Button
                            type="submit"
                            tabIndex={5}
                            disabled={processing}
                            data-test="register-user-button"
                            className="mt-2 h-12 w-full rounded-xl bg-[#b91c1c] text-sm font-bold text-white shadow-lg shadow-red-900/15 transition-all hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/20"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Court Avenue account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </>
                )}
            </Form>

            {/* Login */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <TextLink
                    href={login()}
                    tabIndex={6}
                    className="font-semibold text-[#b91c1c] hover:text-red-800"
                >
                    Log in
                </TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: "Join Court Avenue",
    description:
        "Create your account and start booking your next pickleball game.",
};
