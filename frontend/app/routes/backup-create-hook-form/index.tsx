import type React from "react";
import { useState, useRef, type FormEvent } from "react";
import { Upload, Globe, Twitter, Send, X, Check, AlertCircle } from "lucide-react";
import { DynamicHeader } from "@fund/dynamic-header";
import { ScrambleText } from "@fund/scramble-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Textarea } from "@shadcn/textarea";
import { Checkbox } from "@shadcn/checkbox";
import { Button } from "@shadcn/button";
import { Card, CardContent } from "@shadcn/card";
import { ModalCreate } from "./modal";

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  ticker: z.string().min(1, "Ticker is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Create() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticker: "",
      description: "",
      website: "",
      twitter: "",
      telegram: "",
      agreedToTerms: false,
    },
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    setShowModal(true);
  });

  const confirmLaunch = () => {
    const formData = form.getValues();
    console.log({ ...formData, image });
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full min-h-screen mx-auto py-6 px-4 sm:px-6 lg:px-8 xl:max-w-6xl mb-20">
        <p className="col-span-12 text-4xl sm:text-6xl lg:text-9xl my-12 lg:my-24 text-center">
          <ScrambleText title="Launch your token" />
        </p>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg sm:text-xl">Funding Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Example: "Eliska"'
                          className="p-3 text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg sm:text-xl">Ticker</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Example: "$ELISK"'
                          className="p-3 text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg sm:text-xl">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain your project"
                          className="p-3 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel className="block text-lg sm:text-xl mb-2">
                    Upload Profile Image
                  </FormLabel>
                  <div
                    className="border border-input rounded-lg bg-background p-4 flex items-center justify-center cursor-pointer h-[180px] sm:h-[200px]"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    {preview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={preview}
                          alt="Token logo preview"
                          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="border border-dashed border-input rounded-lg p-4 sm:p-6">
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
                          Drag & drop or click to upload (max 1 MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <FormLabel className="block text-lg sm:text-xl">
                    Social Links (optional)
                  </FormLabel>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <FormControl>
                            <Input
                              placeholder="Website URL"
                              className="p-3 text-sm sm:text-base"
                              type="url"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Twitter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <FormControl>
                            <Input
                              placeholder="Twitter handle"
                              className="p-3 text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <FormControl>
                            <Input
                              placeholder="Telegram handle"
                              className="p-3 text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Card className="border border-input">
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="agreedToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <div className="flex flex-row space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 mr-2 sm:mr-3 flex-shrink-0"
                          />
                        </FormControl>
                        <div className="text-sm sm:text-base">
                          I agree that I am creating a funding token with a fixed supply of
                          1,000,000,000 tokens. I understand that as the deployer, I will receive 2%
                          of the total supply with vesting conditions (50% unlocked at $1M market
                          cap, 50% at $3M market cap). I confirm that I have reviewed all
                          information and am ready to deploy this token to the market.
                        </div>
                      </div>
                      <FormMessage className="block" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={!form.watch("agreedToTerms")}
              className={`w-full py-3 sm:py-4 font-medium rounded-lg transition-colors ${
                form.watch("agreedToTerms")
                  ? "bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Launch
            </Button>
          </form>
        </Form>

        {showModal && (
          <ModalCreate
            name={form.getValues("name")}
            ticker={form.getValues("ticker")}
            onClose={() => setShowModal(false)}
            onConfirm={confirmLaunch}
          />
        )}
      </div>
    </>
  );
}