import Badge from "../ui/Badge";

export default function UserProfileModal({
  data,
  onClose,
}: {
  data: any;
  onClose: () => void;
}) {
  const { user, profile } = data;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-slate-500"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">User Profile</h3>

        {/* Basic info */}
        <div className="space-y-1 mb-4">
          <p>
            <strong>Name:</strong> {user.name || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <Badge
            label={user.isActive ? "Active" : "Blocked"}
            color={user.isActive ? "green" : "red"}
          />
        </div>

        {/* Role-specific profile */}
        {!profile && <p className="text-slate-500">Profile not set up yet</p>}

        {profile && (
          <div className="mt-4 space-y-2">
            {user.role === "SENIOR" && (
              <>
                <p>
                  <strong>Age:</strong> {profile.age}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
                <p>
                  <strong>Medical Info:</strong> {profile.medicalInfo || "—"}
                </p>
              </>
            )}

            {user.role === "FAMILY" && (
              <>
                <p>
                  <strong>Relation:</strong> {profile.relation}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address || "—"}
                </p>
                <p>
                  <strong>Primary Contact:</strong>{" "}
                  {profile.isPrimaryContact ? "Yes" : "No"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
