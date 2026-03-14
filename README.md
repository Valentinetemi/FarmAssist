<div align="center">

<img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop" alt="FarmAssist Banner" width="100%" style="border-radius: 12px; max-height: 300px; object-fit: cover;" />

<br />
<br />

# 🌾 FarmAssist AI

### *AI-powered farm advisor for smallholder farmers worldwide*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Amazon Nova](https://img.shields.io/badge/Amazon-Nova%20AI-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

<br />

> **Built for the Amazon Nova AI Hackathon 2026**  
> Category: Social Impact · Agriculture · AI for Good

<br />

[🚀 Live Demo](#) · [📹 Watch Demo Video](#) · [🐛 Report Bug](#)

</div>

---

## 🌍 The Problem

Over **33 million smallholder farmers** across Africa and the developing world make life-changing decisions every single day — what to plant, how to treat sick crops, when to sell, where to buy supplies, with **zero access to expert agricultural guidance.**

A bad decision doesn't just mean a bad harvest. It means a family goes hungry. It means a child doesn't go to school. It means a livelihood is lost.

**FarmAssist changes that.**

---

## 💡 The Solution

FarmAssist is an **AI-powered farm advisor** that puts expert agricultural knowledge in every farmer's pocket — for free, in their language, available 24/7.

Powered by **Amazon Nova** through AWS Bedrock, FarmAssist understands natural language questions about crops, pests, weather, market prices, and more — and responds with clear, practical, actionable advice tailored to African and global farming contexts.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🌱 **Crop Planning** | Personalized planting advice based on season, location & soil type |
| 🐛 **Pest & Disease Detection** | Describe symptoms and get instant diagnosis + treatment plan |
| 🌦️ **Weather Guidance** | Rainy and dry season farming tips tailored to your region |
| 💰 **Market Intelligence** | Know which crops are most profitable right now |
| 🧪 **Fertilizer Guide** | Exactly what to apply, when, and how much |
| 🏪 **Supply Locator** | Find seeds, fertilizers, and equipment near you |
| 🗣️ **Voice Input** | Speak your question — no typing needed |
| 🌍 **Multi-language** | English, Yoruba, Hausa, Igbo, Français, Swahili |
| 💬 **Chat History** | All conversations saved and accessible from the sidebar |
| 📱 **Fully Responsive** | Works beautifully on mobile, tablet, and desktop |

---

## 🎬 Demo

> The app opens with a clean, professional splash screen before revealing a stunning chat interface packed with warm earthy greens and premium typography.

**Try asking:**
- *"What crops should I plant this rainy season in Nigeria?"*
- *"I see yellow spots on my cassava leaves — what is it?"*
- *"What is the best fertilizer for maize and when should I apply it?"*
- *"Which crops are selling for the best prices right now?"*

---

## 🛠️ Tech Stack

```
Frontend        →  Next.js 14 (App Router) + TypeScript + Tailwind CSS
AI Model        →  Amazon Nova Lite via AWS Bedrock
Rendering       →  react-markdown for rich formatted responses
Voice Input     →  Web Speech API (Chrome/Edge)
Icons           →  lucide-react
Fonts           →  Cabinet Grotesk + Satoshi + JetBrains Mono
Deployment      →  Vercel
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account with Bedrock access
- Amazon Nova model enabled in AWS Bedrock

### 1. Clone the repository

```bash
git clone https://github.com/your-username/farmassist-ai.git
cd farmassist-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

> ⚠️ Never commit your `.env.local` file. It is already in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
farmassist-ai/
├── app/
│   ├── page.tsx                    # Entry point
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles & animations
│   ├── components/
│   │   └── FarmAssist.tsx          # Main UI component
│   └── api/
│       └── chat/
│           └── route.ts            # Amazon Nova API route
├── public/
├── .env.local                      # API keys (never commit)
├── tailwind.config.ts
└── README.md
```

---

## 🤖 How the AI Works

Every message is sent to **Amazon Nova Lite** via AWS Bedrock with a carefully crafted system prompt that instructs the model to:

- Act as an expert agricultural advisor for African farmers
- Give practical, concise, farmer-friendly advice
- Respond appropriately based on the selected language
- Structure responses with clear headings, lists, and actionable steps

```
User message → Next.js API Route → AWS Bedrock (Amazon Nova) → Formatted response → React Markdown renderer → Beautiful UI
```

---

## 🌱 Impact

FarmAssist is designed to directly address **UN Sustainable Development Goal 2: Zero Hunger** by empowering smallholder farmers with knowledge that:

- 📉 **Reduces crop losses** from preventable pest damage and poor planting decisions
- 📈 **Increases income** by connecting farmers to the best market opportunities  
- 🍽️ **Improves food security** at the household and community level
- 🎓 **Democratizes agricultural expertise** previously only available to large commercial farms

---

## 🏆 Hackathon

This project was built for the **Amazon Nova AI Hackathon 2026**.

**Why Amazon Nova?**
- Fast, intelligent responses even for complex agricultural questions
- Cost-effective — critical for a free tool targeting low-income farmers
- Reliable AWS infrastructure ensures uptime in regions across Africa
- Multimodal capabilities open the door to future photo-based pest detection

---

## 🗺️ Roadmap

- [ ] Photo upload for visual pest and disease identification
- [ ] SMS fallback via Twilio for farmers without smartphones
- [ ] Real-time local market price data integration
- [ ] Offline mode with cached common answers
- [ ] Native Android & iOS apps
- [ ] Community farmer-to-farmer knowledge sharing

---

## 👨‍💻 Author

Built with ❤️ for farmers everywhere.

---

## 📄 License

MIT — free to use, fork, and build upon.

---

<div align="center">

**🌾 FarmAssist — Because every farmer deserves expert advice.**

</div>
