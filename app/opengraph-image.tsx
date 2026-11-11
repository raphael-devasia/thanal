import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Greymatters Eldercare Concierge Kerala";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#122617",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative background gradient accent */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(241, 229, 198, 0.15) 0%, rgba(18, 38, 23, 0) 70%)",
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#F1E5C6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#122617",
                fontSize: "26px",
                fontWeight: 900,
              }}
            >
              G
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <div style={{ display: "flex", fontSize: "32px", fontWeight: 800 }}>
                <span style={{ color: "#aca298" }}>grey</span>
                <span style={{ color: "#d3901b" }}>matters</span>
              </div>
              <span
                style={{
                  color: "#F1E5C6",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Eldercare Concierge
              </span>
            </div>
          </div>
        </div>

        {/* Main Value Proposition */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 10,
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              color: "#F1E5C6",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            For Sons and Daughters Living Abroad
          </div>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "54px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            Dedicated Eldercare, Hospital OPD Escorting and Companionship in Kerala.
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "24px",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Zero commissions. Zero markup. Direct doctor note summaries and real-time WhatsApp updates delivered to your phone.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#183825",
              border: "1px solid rgba(241, 229, 198, 0.2)",
              padding: "10px 22px",
              borderRadius: "12px",
            }}
          >
            <span style={{ color: "#F1E5C6", fontSize: "16px", fontWeight: 700 }}>
              Hospital OPD Escort
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#183825",
              border: "1px solid rgba(241, 229, 198, 0.2)",
              padding: "10px 22px",
              borderRadius: "12px",
            }}
          >
            <span style={{ color: "#F1E5C6", fontSize: "16px", fontWeight: 700 }}>
              Zero Markup Mobility Float
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#183825",
              border: "1px solid rgba(241, 229, 198, 0.2)",
              padding: "10px 22px",
              borderRadius: "12px",
            }}
          >
            <span style={{ color: "#F1E5C6", fontSize: "16px", fontWeight: 700 }}>
              WhatsApp Family Feed
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#F1E5C6",
              padding: "10px 22px",
              borderRadius: "12px",
            }}
          >
            <span style={{ color: "#122617", fontSize: "16px", fontWeight: 800 }}>
              Single Visits from ₹1,500
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
