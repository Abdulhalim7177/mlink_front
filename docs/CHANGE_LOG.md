# Market-Link — Frontend Change Log

> This document provides a detailed change log for the Market-Link frontend web application, outlining components, feature integrations, and state structures built natively across iterations.
> WebCortex Technologies Limited · v1.0 · April 2026

## [2026-04-09] - v1.0.2

### Added

- Scaffolded the multi-step `VerificationPage` module replacing the legacy UI natively incorporating Step indicators mapping directly to API endpoints. 
- Designed `BusinessProfileStep` hooked defensively into Zod and `react-hook-form` validating primary registration data.
- Built explicit Javascript `FormData` logic wrapping `KycUploadStep` file packages natively processing binary drops securely via Axios constraints. 
- Created atomic `ReviewSubmitStep` dynamically tracking the final Terms of Service trigger pushing users cleanly into S5 algorithms efficiently. 

### Updated

- Inserted reactive `Awaiting Verification` alert banner globally across the persistent Dashboard layout intelligently preventing re-submits until queue processing concludes.
- Hardened multipart validators requiring exactly 5 blob variables universally. 


## [2026-05-25] - v1.0.3

### Added

- Scaffolded the `UnifiedChat` module handling robust real-time text, voice notes, and group calls across Clusters, Projects, and Inquiries.
- Developed the `CallInterface` for WebRTC voice communication featuring mesh-topology peer connections and isolated Supabase Realtime channels (`call_room:<callId>`).
- Built an Active Speaker Visualizer using the Web Audio API to display animated frequency waves for speaking participants.
- Implemented a `GlobalCallManager` integrated into the `DashboardLayout` to intercept incoming call signaling app-wide and present a ringing `CallNotification` component.
- Implemented rich `CallHistory` views featuring HoverCards displaying complete participant profile details and avatars.

### Updated

- Updated `ChatInterface` and `ConversationList` to parse and beautifully render active `inquiry` listing titles (e.g., "Re: Cashew Nuts").
- Fixed React dependency arrays in `CallInterface` to isolate peer initialization from call duration timers.
- Overhauled the `ChatInterface` WebSocket client logic to ensure immediate text rendering without requiring manual page refreshes.
