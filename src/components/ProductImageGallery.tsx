import Image from "next/image";

const ProductImageGallery = () => {
  return (
    <div className="space-y-4">
      <div className="aspect-w-1 aspect-h-1 bg-subtle-light dark:bg-subtle-dark rounded-lg overflow-hidden border border-subtle-light dark:border-subtle-dark relative">
        <Image
          alt="Main product image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuANXiy7FX2xa0IL7WgSxIIdKQ3dr3-J2xBSzQDS3CAeUcddKwsFCa6EA9Rtk9sbMDFX4wJaR4O9E1azZmrFIuPneS6JI-GBCCETY5ytxdjC4qy5nvL_JRBByZLd4Rw95fKM9eWTWF3QUSSJWdF1tH0EvXp-Varl9r8TLvjcgOGctRr-b85GSLZav3fdK5nNn9OXfguuWGRom1RPkIFEGS463H-vLipjpmciJ8AgbHTJC6BL9NG2yRde2esLX0bqTH_FLdkxI59AGvg"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 border-primary ring-2 ring-primary/50 relative">
          <Image
            alt="Thumbnail 1"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsL_pSi3LWy8o5oUN7J12lA6wxoM_0QmpywyUB1npuMYiWx4BXAn2j2UBHGu8aN8k5QLZN_PfytfYvEDU_dkY9Qk2OtY2wFynm_BrTXpgTKhuR2_-aCcuPUM_CGtZ2D71GXhnZcvgIbtMQiQGfYcUUOxIjNUi0FLCfwJGuABMnCpPkhRMbJeFAIHdzRLX5_08D8jfDxhN6EcP2c8zBHbLan7IeSIdnNhEqZf1i2oKCsSLEqjdmXleOnALlz144T4xtDbmnZLClKBc"
            fill
            sizes="(max-width: 768px) 25vw, 12vw"
            className="object-cover object-center"
          />
        </div>
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden opacity-75 hover:opacity-100 transition-opacity relative">
          <Image
            alt="Thumbnail 2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ModgHoRHdsFQPcwZL8UnLgPph9t-T-w-SOHyyyEj5DcM6QknTEw5fCmw3I_sJh_fqVbFShOECAD4s4nZqWwHTuUpUEMDx17d8fYmo3-_J9SoZ3__IGZItSmz7mJGWAo2nbkh23V07IfAogDuEr_XfxWoyv4Tm1LYdCzGi0uz05V9idd05NTUiC7xaTAsE7lxM5X6uRCeoEffHOXNwo-hXm3JwY52fxc4Ggyk11h4WS9cnK7iZFuBdS0iGcNNitXq3IFXvOwIWp0"
            fill
            sizes="(max-width: 768px) 25vw, 12vw"
            className="object-cover object-center"
          />
        </div>
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden opacity-75 hover:opacity-100 transition-opacity relative">
          <Image
            alt="Thumbnail 3"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbiBEVYrR3e2WrkuQDX-8vIsamxIdR9HEmzOSPcp2R_e2OPiSyZqOkLCF-d-MzMYejinxsTxuL8eCpDYOm6Bpzg2bLjn65ef4smuRQDzT_ZxarjDlC2dAsYv3ki5UNTfUET4CsJ11D-qXpqyuRRHuCsIVKYDok7IsdW7zIX3WwK9vUZdHKUtsN8iQBC8v12b2_iWqpmfpQownUTpTrSpaXz_UBeR4n8akvh9oFQLEUya0-BwAq1fB2rsxYXtt0BYDeFk6-CbJFJuA"
            fill
            sizes="(max-width: 768px) 25vw, 12vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
