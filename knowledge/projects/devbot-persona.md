# Project Case Study: DevBot — AI Persona Chatbot Platform

## Overview

- **Repository**: https://github.com/anantyash/DevBot-Persona-AI
- **Category**: Conversational AI, Prompt Engineering, Streaming REST APIs
- **Core Technologies**: Node.js, Express.js, Google Gemini API, Prompt Engineering, Tailwind CSS.

## Problem Statement

Standard AI chatbots often deliver generic, flat responses lacking context-specific tone, domain boundary awareness, or consistent behavioral personality.

## Technical Architecture & Implementation

1. **Configurable Persona Modeling**: Implemented structured system prompt templates that define distinct developer personalities (e.g., Senior Systems Architect, Strict Code Reviewer, Pragmatic Full-Stack Engineer) with explicit tone, vocabulary constraints, and technical heuristics.
2. **Asynchronous Streaming REST Backend**: Built an Express.js API that streams tokens asynchronously from the Gemini API to the client, providing real-time interactive feedback with sub-second time-to-first-token.
3. **Structured Response Parsing**: Built JSON schema validators that parse structured LLM outputs, ensuring predictable client rendering.
4. **Dynamic Persona Switching**: Allowed users to switch personas seamlessly in mid-session while preserving contextual conversation history within safe token limits.
