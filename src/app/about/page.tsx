export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center">
          <div className="mb-12 w-full overflow-hidden rounded-xl shadow-lg">
            <div
              className="h-96 w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAxLggSz4MpWIgpVwOt-y5MUMbtmuc2IeFXYkaFQ_XGy2zbAecVHjTgw5mhDrkqpGze9DQ4tl44_xt_jyCf2sKmM40A0dUK63CRLnW3TT8aD7PJDyTVixiUFSNKfic8bPShUMFo_1otAVr3Hwo6-PwHKC4SioLHGk1iVmFUh-gB022ItS2iat3d2rWj5tFDG8bvxwne6RDeQcJx6yjdQB3KKUu-9YgGtH0HdF1P01YSGDTVQGoN6NIz0so2qQolOIZ7x2qrZGpI_Mj')",
              }}
            />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Our Family, Serving Yours
            </h1>
            <p className="mt-6 text-lg leading-7 text-slate-600">
              At DARNA SHOP, we&apos;re more than just a business; we&apos;re a family-run enterprise deeply rooted in the heart
              of Algeria. Our mission is to provide Algerian families with access to high-quality clothing, toys, and
              electronics, all while ensuring a seamless and trustworthy shopping experience. We&apos;re committed to serving
              our community with the same care and dedication we show our own family.
            </p>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              From our humble beginnings to becoming a trusted name in Algerian e-commerce, our journey has been fueled
              by a passion for quality and a commitment to our customers. We believe in the power of family, both within
              our team and in the homes we serve. Thank you for being a part of the DARNA SHOP family.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                "About Us",
                "Contact",
                "FAQ",
                "Privacy Policy",
                "Terms of Service",
              ].map((label) => (
                <a key={label} className="text-sm font-medium text-slate-600 hover:text-[var(--color-primary)]" href="#">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex justify-center gap-6">
              {["fb", "ig", "tw"].map((key) => (
                <a key={key} className="text-slate-500 transition-colors hover:text-[var(--color-primary)]" href="#">
                  <span className="sr-only">{key}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-sm text-slate-500">© 2023 DARNA SHOP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
