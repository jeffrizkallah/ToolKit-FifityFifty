# FiftyFifty x UN Women Campaign Toolkit -- Feature Matrix & UI Brainstorm

## 1. Overview

This document summarizes the approved **UX/UI direction** and **Feature
Matrix** for the FiftyFifty x UN Women Campaign Toolkit.\
It captures visual identity, structure, and functionality decisions made
during brainstorming sessions.

------------------------------------------------------------------------

## 2. Visual Identity

**Primary Blue:** `#0063AF`\
**Secondary Red:** `#EC1C24`\
**Tertiary White:** `#FFFFFF`\
**Neutral Base:** `#F6F6F6`, `#DDDDDD`, `#222222`

Design principles: - Clean, modern, accessible - Emphasis on clarity,
inclusivity, and empowerment - Responsive, bilingual (Arabic /
English) - Contrast checked for accessibility compliance

------------------------------------------------------------------------

## 3. UI Layout Summary

### Landing Page

-   Hero banner: title, short description, and 2 CTAs (Start Journey /
    Watch Video)
-   Six-phase horizontal journey timeline with hover animation
-   Testimonials slider
-   Footer with brand colors and links

### Phase Page

-   Header video introducing the phase
-   4--6 topic cards per phase with title, summary, video, and resources
-   Progress indicator + "Next Phase" button

### Topic Page

-   Embedded 2-min video
-   Key takeaways list
-   Downloadable materials section
-   "Next" and "Previous" navigation

------------------------------------------------------------------------

## 4. Interaction Flow

1.  Home → Select Phase → Open Module → Watch Video → Download Resource
    → Proceed\
2.  Breadcrumbs visible on all pages\
3.  Optional progress tracking (browser-based)\
4.  Instant bilingual switch (Arabic ↔ English)

------------------------------------------------------------------------

## 5. Feature Matrix

  --------------------------------------------------------------------------------------
  Feature         Description    Owner / Implementer   Type        Priority   Status
  --------------- -------------- --------------------- ----------- ---------- ----------
  Landing Page    Hero banner    Web Dev / UI Team     Frontend    High       ✅
                  with headline                                               Approved
                  and CTAs.                                                   

  Six-Phase       Scroll or grid Web Dev / UX          Frontend    High       ✅
  Timeline        with 6                                                      Approved
                  campaign                                                    
                  phases and                                                  
                  hover effects.                                              

  Phase Page      Video header + Web Dev               Frontend    High       ⏳ Pending
  Template        module cards                                                
                  for each                                                    
                  topic.                                                      

  Topic Card      Cards with     UI Dev                Frontend    High       ✅
  Components      title,                                                      Approved
                  summary,                                                    
                  video, and                                                  
                  resources.                                                  

  Video           Embedded 2-min Media Team            Backend +   High       ⏳ Pending
  Integration     video player                         Frontend               
                  with bilingual                                              
                  subtitles.                                                  

  Downloadable    Linked PDFs,   Content / Web Dev     Backend     High       ⏳ Pending
  Resources       Excel                                                       
                  templates, or                                               
                  checklists per                                              
                  module.                                                     

  Language Toggle Arabic ↔       Web Dev               Frontend    High       ⏳ Pending
                  English                                                     
                  instant                                                     
                  switch.                                                     

  Progress        Saves          Dev                   Frontend    Medium     🟡 Planned
  Tracker         completed                                                   
                  phases                                                      
                  locally.                                                    

  Search & Filter Search by      Dev                   Backend +   Medium     🟡 Planned
                  keyword or                           Frontend               
                  filter by                                                   
                  topic.                                                      

  Accessibility   High contrast, UX / Dev              UX /        High       ✅
                  readable                             Frontend               Approved
                  fonts, RTL                                                  
                  support.                                                    

  Responsive      Works          UI Dev                Frontend    High       ✅
  Layout          seamlessly on                                               Approved
                  mobile and                                                  
                  desktop.                                                    

  Resource        Central hub    Web Dev               Backend     Medium     🟡 Planned
  Library         for all                                                     
                  templates and                                               
                  videos.                                                     

  Testimonials    Rotating       UI Dev                Frontend    Medium     ✅
  Section         quotes and                                                  Approved
                  candidate                                                   
                  photos.                                                     

  Analytics       Track visits,  Web Dev               Backend     Medium     ⏳ Pending
  Tracking        views, and                                                  
                  downloads.                                                  

  Footer Section  Logos,         UI Dev                Frontend    Low        ✅
                  credits, and                                                Approved
                  language                                                    
                  toggle.                                                     

  CMS             Backend for    Web Dev               Backend     High       ⏳ Pending
                  editing text                                                
                  and uploading                                               
                  modules.                                                    

  Admin Role      Different      Dev                   Backend     Medium     🟡 Planned
  Management      permissions                                                 
                  (editor,                                                    
                  reviewer).                                                  

  Privacy         Cookie notice  Legal / Dev           Backend     Medium     🟡 Planned
  Compliance      and privacy                                                 
                  statement.                                                  

  Performance     Lazy load,     DevOps                Backend     Medium     🟡 Planned
  Optimization    caching, and                                                
                  image                                                       
                  compression.                                                
  --------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 6. Phase Priorities

**Phase 1 (MVP)**\
Landing Page, Six-Phase Timeline, Phase/Topic Pages, Videos, Resources,
Bilingual Toggle, Accessibility

**Phase 2 (Post-Launch)**\
Progress Tracker, Search & Filter, Analytics, CMS Enhancements, Resource
Library

**Phase 3 (Future)**\
AI Chatbot, User Accounts, Feedback System, Gamified Badges

------------------------------------------------------------------------

## 7. Notes

-   This document serves as the foundation for design and development
    handoff.\
-   All UI layouts follow the approved color palette (#0063AF, #EC1C24,
    #FFFFFF).\
-   Next step: move to **Architecture Design** for CMS structure and
    content workflow.

------------------------------------------------------------------------
