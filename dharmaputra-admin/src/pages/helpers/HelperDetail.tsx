import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getHelperByIdAPI,
  approveHelperAPI,
  rejectHelperAPI,
} from "../../api/helpers.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function HelperDetail() {
  const { helperId } = useParams<{ helperId: string }>();
  const navigate = useNavigate();

  const [helper, setHelper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);

  const loadHelper = async () => {
    try {
      setLoading(true);
      const data = await getHelperByIdAPI(helperId!);
      setHelper(data);
    } catch (err) {
      console.error("Failed to load helper", err);
      alert("Failed to load helper details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelper();
  }, [helperId]);

  const approveHelper = async () => {
    await approveHelperAPI(helper._id);
    loadHelper();
  };

  const rejectHelper = async () => {
    const confirm = window.confirm("Reject / disable this helper?");
    if (!confirm) return;

    await rejectHelperAPI(helper._id);
    loadHelper();
  };

  if (loading) return <p className="text-slate-500">Loading helper...</p>;
  if (!helper) return <p className="text-red-500">Helper not found</p>;

  const statusLabel = helper.isVerified
    ? "Approved"
    : helper.isActive
    ? "Pending"
    : "Rejected";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={helper.profileImage || "/logo.png"}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {helper.firstName} {helper.lastName}
            </h1>
            <Badge
              label={statusLabel}
              color={
                statusLabel === "Approved"
                  ? "green"
                  : statusLabel === "Pending"
                  ? "yellow"
                  : "red"
              }
            />
          </div>
        </div>

        <Button onClick={() => navigate(-1)}>← Back</Button>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        {!helper.isVerified && helper.isActive && (
          <Button onClick={approveHelper}>Verify Helper</Button>
        )}
        {helper.isActive && (
          <Button variant="danger" onClick={rejectHelper}>
            Reject Helper
          </Button>
        )}
        {/* {helper.idCardImage && (
          <Button onClick={() => setShowIdCard(true)}>View ID Card</Button>
        )} */}
        <Button onClick={() => setShowIdCard(true)}>View ID Card</Button>
      </div>

      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Info label="Phone" value={helper.phone} />
        <Info label="Age" value={helper.age} />
        <Info label="Education" value={helper.education} />
        <Info label="Availability" value={helper.availability} />
        <Info
          label="Rating"
          value={`${helper.rating?.average || 0} ⭐ (${
            helper.rating?.count || 0
          })`}
        />
      </Section>

      {/* ADDRESS */}
      {helper.address && (
        <Section title="Address">
          <Info label="Full Address" value={helper.address.fullAddress} />
          <Info label="House No" value={helper.address.houseNo} />
          <Info label="Area" value={helper.address.area} />
          <Info label="City" value={helper.address.city} />
          <Info label="District" value={helper.address.district} />
          <Info label="State" value={helper.address.state} />
          <Info label="Country" value={helper.address.country} />
          <Info label="Pincode" value={helper.address.pincode} />
        </Section>
      )}

      {/* WORK LINKS */}
      <Section title="Work Links">
        <Info
          label="Linked Seniors"
          value={helper.linkedSeniorIds?.length || 0}
        />
      </Section>

      {/* ID CARD MODAL */}
      {showIdCard && (
        <Modal onClose={() => setShowIdCard(false)}>
          {helper.idCardImage ? (
            <img
              src={helper.idCardImage}
              alt="ID Card"
              className="w-full rounded-lg"
            />
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-600 font-medium">No ID card uploaded</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* =========================
   SMALL REUSABLE COMPONENTS
   ========================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: any }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      {value ?? <span className="text-slate-400">—</span>}
    </p>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-w-lg w-full bg-white p-6 rounded-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
