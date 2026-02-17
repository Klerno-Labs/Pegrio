# 📅 Calendly Setup Guide

Complete guide to setting up appointment scheduling for discovery calls.

---

## 🎯 Why Calendly?

**Calendly is the best choice because:**
- ✅ Free forever plan (perfect for starting)
- ✅ Automatic calendar sync (Google, Outlook, iCloud)
- ✅ Eliminates back-and-forth emails
- ✅ Professional appearance
- ✅ Automatic reminders (reduces no-shows by 80%)
- ✅ Custom branding
- ✅ Integrates with everything (HubSpot, Salesforce, Stripe, Zapier)

**Alternative options:**
- Cal.com (open-source)
- Savvy Cal (fancy UI)
- Acuity Scheduling (more features, costs money)

But honestly, **start with Calendly** - it's what 95% of professionals use.

---

## ⚡ Quick Setup (10 Minutes)

### Step 1: Create Calendly Account

1. Go to [calendly.com](https://calendly.com)
2. Click "Sign up free"
3. Choose "I schedule meetings for myself"
4. Connect your calendar (Google/Outlook/iCloud)

### Step 2: Create "Discovery Call" Event

1. Click "New Event Type"
2. Select **"One-on-One"**
3. Fill in details:

```
Event Name: Discovery Call
Location: Zoom (Calendly will create link automatically)
Duration: 30 minutes
Description:
Let's discuss your website vision! On this call we'll:
• Understand your business goals
• Review your must-have features
• Discuss timeline and budget
• Answer all your questions
• Create a custom proposal just for you

Come prepared with:
- Examples of websites you love
- Your rough timeline
- Any specific features you need
```

4. Click "Next"

### Step 3: Configure Availability

**When are you available for calls?**

Example schedule:
- **Monday-Friday**: 10am - 5pm
- **Buffer time**: 15 minutes between calls
- **Minimum notice**: 24 hours (prevents last-minute bookings)
- **Date range**: 60 days into the future

Tips:
- Block out lunch (12-1pm)
- Don't offer evenings/weekends unless you want evening calls
- Leave buffer time to prep between calls

### Step 4: Add Custom Questions

This pre-qualifies leads and gives you context before the call.

**Questions to add:**

1. **Business/Organization Name** *(Required)*
   - Type: Short text
   - This helps you research them before the call

2. **What type of website do you need?** *(Required)*
   - Type: Multiple choice
   - Options:
     - Business website (brochure site)
     - E-commerce store
     - Blog/Content site
     - Booking/Appointment site
     - Portfolio site
     - Other

3. **What's your estimated budget?** *(Required)*
   - Type: Multiple choice
   - Options:
     - $2,000 - $3,000 (Essential)
     - $3,000 - $6,000 (Professional)
     - $6,000+ (Premium)
     - Not sure yet

4. **Tell us about your project** *(Optional)*
   - Type: Long text
   - Placeholder: "Any details you want to share? Features you need? Timeline preferences?"

5. **How did you hear about us?** *(Optional)*
   - Type: Multiple choice
   - Options: Google, Facebook, Referral, Instagram, Other

### Step 5: Customize Branding

1. Go to Settings → Branding
2. Upload your logo
3. Choose brand color: #667eea (Pegrio blue)
4. Add custom welcome message:

```
Thanks for your interest in working with Pegrio!

I'm excited to learn about your project and show you how we can build an amazing website that grows your business.

Select a time that works for you below. See you soon!

- [Your Name]
```

### Step 6: Set Up Notifications

**Email Confirmations:**
- ✅ Send confirmation to invitee (customer)
- ✅ Send confirmation to you
- ✅ Enable calendar invites (adds to both calendars)

**Reminders:**
- ✅ 24 hours before: Email reminder
- ✅ 1 hour before: Email + SMS reminder (reduces no-shows!)

**Follow-ups:**
- ✅ 1 hour after: "Thanks for the call" email
   - Customize this to say you'll send proposal within 24 hours

### Step 7: Get Your Scheduling Link

1. Go to your event
2. Click "Copy Link"
3. Your link looks like:
   ```
   https://calendly.com/your-username/discovery-call
   ```

4. Add to `.env.local`:
   ```
   CALENDLY_USERNAME=your-username
   CALENDLY_EVENT_URL=https://calendly.com/your-username/discovery-call
   ```

---

## 🎨 Advanced Customization

### Custom Domain (Professional)

Instead of `calendly.com/yourname`, use `schedule.yourdomain.com`:

1. Upgrade to Pro plan ($12/month)
2. Go to Settings → Custom Domain
3. Add CNAME record to your DNS:
   ```
   schedule.yourdomain.com → calendly.com
   ```
4. Verify domain
5. Now your link is: `schedule.yourdomain.com/discovery-call`

**Worth it?** Only if you do 10+ calls/month and want to look extra professional.

### Video Conferencing

**Best options:**

1. **Zoom** (Most professional)
   - Connect your Zoom account
   - Calendly auto-generates unique links
   - Includes dial-in numbers
   - Recording capability

2. **Google Meet** (Easiest)
   - Built into Google Calendar
   - No app download needed
   - Simple and reliable

3. **Microsoft Teams** (Enterprise)
   - For corporate clients
   - Integration with Office 365

**Recommendation:** Start with Zoom (free plan allows 40-minute calls).

### Automated Workflows (Zapier)

Connect Calendly to other tools:

**Popular workflows:**

1. **New booking → Add to CRM**
   - Calendly → Zapier → HubSpot
   - Auto-creates deal when call is booked

2. **New booking → Slack notification**
   - Get pinged when someone books
   - Includes their details + questions

3. **New booking → SMS reminder to you**
   - Never miss a call again

4. **Call completed → Send proposal template**
   - Auto-send follow-up email with proposal link

**Setup:**
1. Go to calendly.com/integrations
2. Connect Zapier
3. Create "Zaps" for each workflow

---

## 💬 Pre-Call Email Template

Calendly sends this automatically 24 hours before:

```
Subject: Looking forward to our call tomorrow at [TIME]!

Hi [Name],

This is a friendly reminder that we have a discovery call scheduled for:

📅 [Date] at [Time] ([Timezone])
🔗 Join via Zoom: [Zoom Link]

To make the most of our 30 minutes, please come prepared with:

✓ Examples of 2-3 websites you love (any industry)
✓ Your must-have features (e.g., contact form, online booking, e-commerce)
✓ Your ideal launch timeline
✓ Questions for me!

I've reviewed the details you provided and have some great ideas to share.

If you need to reschedule, just click here: [Reschedule Link]

See you tomorrow!

[Your Name]
Pegrio
[Phone] | [Email]
```

---

## 🎯 During the Call (Checklist)

Use this checklist on every discovery call:

### Before Call (5 min prep)
- [ ] Review their answers from Calendly form
- [ ] Google their business
- [ ] Check their current website (if they have one)
- [ ] Prepare 2-3 ideas/suggestions

### Opening (5 min)
- [ ] "Thanks for taking the time today!"
- [ ] Brief intro: "I'm [Name], I've built 50+ websites for businesses like yours"
- [ ] Set agenda: "In the next 30 minutes, I want to understand your vision, show you examples, and create a custom plan"
- [ ] Ask: "Before we dive in, anything urgent we should cover?"

### Discovery (15 min)
- [ ] What's your business? (industry, location, target customer)
- [ ] What's working well now? What's not?
- [ ] Why do you need a new website? (real pain point)
- [ ] What does success look like 6 months after launch?
- [ ] Show me 2-3 websites you love - what do you like about them?
- [ ] Must-have features? (e.g., booking, e-commerce, blog)
- [ ] Who are your main competitors? (research later)
- [ ] Timeline? When do you want this live?
- [ ] Budget? (confirm Calendly answer)

### Presentation (8 min)
- [ ] "Based on what you've told me, here's what I recommend..."
- [ ] Share screen → Show 1-2 similar projects you've built
- [ ] Explain your process (Discovery → Design → Dev → Launch)
- [ ] Mention timeline: "6 weeks from payment to launch"
- [ ] Address their specific concerns

### Closing (2 min)
- [ ] "I'll send you a custom proposal within 24 hours"
- [ ] "It'll include exact pricing, what's included, and a payment link"
- [ ] "Sound good?"
- [ ] "Any other questions before we wrap up?"
- [ ] Thank them again

### After Call (Immediate)
- [ ] Send thank you email (within 2 hours)
- [ ] Add to CRM with notes
- [ ] Create custom proposal
- [ ] Generate Stripe payment link
- [ ] Send proposal (within 24 hours)

---

## 📊 Optimize Over Time

### Track These Metrics

| Metric | How to Track | Good Target |
|--------|--------------|-------------|
| **Booking Rate** | Calendly Analytics | 20%+ of site visitors |
| **Show-Up Rate** | Calls held / Calls booked | 80%+ |
| **Close Rate** | Proposals accepted / Calls held | 60%+ |
| **Time to Book** | Days from site visit to booking | <3 days |
| **Average Deal Size** | Total revenue / Deals closed | $5,000+ |

### A/B Test These:

1. **Call duration**
   - Try 15 min, 30 min, 45 min
   - Sweet spot is usually 30 minutes

2. **Availability**
   - Morning vs afternoon slots
   - Weekdays vs weekends
   - Which fills up faster?

3. **Questions**
   - Too many questions = lower booking rate
   - Too few = waste time on bad fits
   - 3-5 questions is optimal

4. **CTA wording**
   - "Schedule Discovery Call" vs "Book Free Consultation"
   - "Get Started" vs "Talk to an Expert"
   - Track which converts better

---

## 🚫 Common Mistakes

### ❌ Being Too Available
**Problem:** Offering 8am-8pm slots, 7 days a week

**Why it's bad:**
- Looks desperate
- No work-life balance
- Attracts tire-kickers

**Fix:** Limited availability = higher perceived value
- 2-hour window per day
- "I'm booked until next week" (even if not true)

### ❌ Free-for-All Booking
**Problem:** Anyone can book anytime with zero friction

**Why it's bad:**
- Time wasters
- Unqualified leads
- Your time is valuable

**Fix:** Add qualifier questions
- Minimum budget requirement
- Business details required
- "Tell us about your project"

### ❌ No Buffer Time
**Problem:** Back-to-back 30-min calls all day

**Why it's bad:**
- No time to prep
- No time to send proposal
- Burnout

**Fix:** 15-30 minute buffer between calls

### ❌ Ignoring No-Shows
**Problem:** 20-30% no-show rate

**Why it's bad:**
- Wasted time blocking your calendar

**Fix:**
- SMS reminders (enable in Calendly)
- Email 1 hour before
- Require confirmation 24 hours prior
- Charge no-show fee (advanced)

---

## ✅ Final Checklist

Before going live with Calendly:

- [ ] Event created with clear description
- [ ] Availability set (with buffer time)
- [ ] Custom questions added (3-5 questions)
- [ ] Branding updated (logo, colors)
- [ ] Email notifications configured
- [ ] Reminders enabled (24hr + 1hr before)
- [ ] Video conferencing connected (Zoom)
- [ ] Calendar synced (Google/Outlook)
- [ ] Link tested (book a test call yourself)
- [ ] Added to website (see integration guide)
- [ ] .env.local updated with Calendly URL

---

## 🎓 Pro Tips

1. **Limit slots** - Only offer 2 calls/day max (creates scarcity)
2. **Block Fridays** - Use for proposal writing, not calls
3. **Batch calls** - Do all calls Tue/Wed/Thu if possible
4. **Record calls** - With permission, for note-taking
5. **Template responses** - Save common answers in notes
6. **Set minimum booking** - At least 24 hours notice
7. **Collect phone** - For SMS reminders (reduces no-shows 50%)
8. **Thank you video** - Send Loom video after call (builds connection)

---

**Your Calendly is ready! Next step: Add it to your website.** 🎯

See [POST-CALL-WORKFLOW.md](POST-CALL-WORKFLOW.md) for what happens after the call!
