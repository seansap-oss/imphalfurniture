import HideOnAdmin from "./HideOnAdmin";
import FooterContent from "./FooterContent";

export default function Footer() {
  return (
    <HideOnAdmin>
      <FooterContent />
    </HideOnAdmin>
  );
}
