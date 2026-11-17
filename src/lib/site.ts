import type { Metadata } from "next";

export const SITE_URL = "https://www.dhakhl.com";

// ponytail: copy of the admin-managed contact data, used for the first HTML,
// JSON-LD and as the footer fallback. Update here if the address or phone changes.
export const SCHOOL = {
  nameEn: "Darul Hikmah Academy, Khulna",
  nameBn: "দারুল হিকমাহ একাডেমি, খুলনা",
  street: "Talukdar Sarak, in front of Khulna University",
  locality: "Khulna",
  address: "Talukdar Sarak, Infront of Khulna University, Khulna University Area, Khulna",
  phone: "+880 1992 866 223",
  email: "dhakh2020@gmail.com",
  officeHours: "Saturday - Thursday: 8:00 AM - 5:00 PM",
  lat: 22.7981292,
  lng: 89.5358316,
  facebook: "https://www.facebook.com/darulhikmahacademy2020",
  youtube: "https://www.youtube.com/@darulhikmahacademy8219",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.116972313652!2d89.5358316!3d22.7981292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff8fb49f3c75ef%3A0x3daf8dc193ae4a7!2sDarul%20Hikmah%20Academy%2C%20Khulna!5e0!3m2!1sen!2sbd!4v1766805535246!5m2!1sen!2sbd",
};

export const SITE_DESCRIPTION =
  "খুলনা বিশ্ববিদ্যালয়ের সামনে, তালুকদার সড়কে বালক ও বালিকাদের ইসলামিক শিক্ষাপ্রতিষ্ঠান। হিফজুল কুরআনের সাথে জাতীয় কারিকুলাম (NCTB), ইসলামি সংস্কৃতি ও ফিকহ। Darul Hikmah Academy Khulna: Hifz and general education for boys and girls.";

/** Title, description and canonical URL for one public page. */
export function pageMeta(title: string, description: string, path: string): Metadata {
  // absolute: a parent layout with a plain title stops the root template from reaching nested pages
  return {
    title: { absolute: `${title.trim()} | ${SCHOOL.nameBn}` },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export const NO_INDEX: Metadata = { robots: { index: false, follow: false } };

export const SCHOOL_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "School",
  name: SCHOOL.nameEn,
  alternateName: [SCHOOL.nameBn, "দারুল হিকমাহ একাডেমি", "DHA Khulna"],
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/cover.png`,
  telephone: SCHOOL.phone.replace(/\s/g, ""),
  email: SCHOOL.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SCHOOL.street,
    addressLocality: SCHOOL.locality,
    addressRegion: "Khulna Division",
    addressCountry: "BD",
  },
  geo: { "@type": "GeoCoordinates", latitude: SCHOOL.lat, longitude: SCHOOL.lng },
  areaServed: "Khulna",
  sameAs: [SCHOOL.facebook, SCHOOL.youtube],
};
