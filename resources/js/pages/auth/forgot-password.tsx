import { Form, Head } from "@inertiajs/react";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "@/routes";
import { email } from "@/routes/password";

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password | Court Avenue" />

            {/* Status */}
            {status && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <Form
                {...email.form()}
                resetOnSuccess={["email"]}
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
                                autoComplete="email"
                                autoFocus
                                placeholder="you@example.com"
                                className="text-black h-12 rounded-xl border-gray-200 bg-gray-50 px-4 transition focus:border-[#b91c1c] focus:bg-white focus:ring-[#b91c1c]/20"
                            />

                            <InputError message={errors.email} />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                            className="h-12 w-full rounded-xl bg-[#b91c1c] text-sm font-bold text-white shadow-lg shadow-red-900/15 transition-all hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/20"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Sending reset link...
                                </>
                            ) : (
                                <>
                                    Send password reset link
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </>
                )}
            </Form>

            {/* Return to login */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <TextLink
                    href={login()}
                    className="font-semibold text-[#b91c1c] hover:text-red-800"
                >
                    Log in
                </TextLink>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: "Forgot your password?",
    description:
        "Enter your email address and we'll send you a secure link to reset your password.",
};
