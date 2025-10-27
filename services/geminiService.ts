
import { GoogleGenAI, Type } from "@google/genai";
import { Post, PostType, Stage, Highlight, User } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// A reliable, hardcoded list of video URLs to be injected client-side.
const RELIABLE_VIDEO_URLS = [
    "https://videos.pexels.com/video-files/4434246/4434246-hd_720_1280_25fps.mp4",
    "https://videos.pexels.com/video-files/4690333/4690333-hd_720_1280_25fps.mp4",
    "https://videos.pexels.com/video-files/8130177/8130177-hd_720_1280_25fps.mp4",
    "https://videos.pexels.com/video-files/7578544/7578544-hd_720_1280_30fps.mp4",
    "https://videos.pexels.com/video-files/2882490/2882490-hd_720_1280_25fps.mp4",
];

const postSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique UUID for the post' },
        author: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: 'A unique UUID for the user' },
                username: { type: Type.STRING, description: 'A unique lowercase username, e.g., "sarah_codes"' },
                displayName: { type: Type.STRING, description: 'The full display name of the user, e.g., "Sarah Drasner"' },
                avatarUrl: { type: Type.STRING, description: 'A URL to a plausible user avatar image. Use https://i.pravatar.cc/150?u=[ID]' },
                bio: { type: Type.STRING, description: 'A short, engaging bio for the user' },
                followerCount: { type: Type.INTEGER, description: 'A random number of followers between 50 and 50000' },
                followingCount: { type: Type.INTEGER, description: 'A random number of accounts the user is following, between 10 and 1000' },
                postCount: { type: Type.INTEGER, description: 'A random number of posts the user has made, between 5 and 200' },
                highlights: {
                    type: Type.ARRAY,
                    description: 'An optional array of 1-3 story highlight objects. For each, provide a title and a cover image URL from picsum.photos.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: 'Unique ID for the highlight' },
                            title: { type: Type.STRING, description: 'Title of the highlight, e.g., "SaaS Journey"' },
                            coverUrl: { type: Type.STRING, description: 'URL for the highlight cover image. Use https://picsum.photos/200?random=[ID]' }
                        },
                        required: ['id', 'title', 'coverUrl']
                    }
                }
            },
            required: ["id", "username", "displayName", "avatarUrl", "bio", "followerCount", "followingCount", "postCount"],
        },
        type: { type: Type.STRING, enum: ['problem', 'idea', 'solution', 'showcase'], description: 'The type of the post' },
        title: { type: Type.STRING, description: 'A catchy and descriptive title for the post (max 15 words).' },
        summary: { type: Type.STRING, description: 'A short summary of the post (max 50 words).' },
        content_md: { type: Type.STRING, description: 'The full content of the post in Markdown format. Should be detailed and between 100 and 500 words.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 3-5 relevant lowercase tags, e.g., ["saas", "ai", "productivity"]' },
        industries: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 1-2 relevant industries, e.g., ["FinTech", "HealthTech"]' },
        stage: { type: Type.STRING, enum: ['idea', 'prototype', 'mvp', 'launched', 'pmf'], description: 'The current stage of the project' },
        coverMedia: {
            type: Type.OBJECT,
            properties: {
                // The AI is now only asked for images to speed up the response.
                type: { type: Type.STRING, enum: ['image'] },
                url: { type: Type.STRING, description: 'A URL for a relevant cover image. Use picsum.photos with varied aspect ratios (e.g., "https://picsum.photos/1080/1350" for portrait, "https://picsum.photos/1080/1080" for square).' },
            },
            required: ["type", "url"],
        },
        stats: {
            type: Type.OBJECT,
            properties: {
                likes: { type: Type.INTEGER, description: 'A random number of likes between 100 and 10000' },
                comments: { type: Type.INTEGER, description: 'A random number of comments between 10 and 500' },
                saves: { type: Type.INTEGER, description: 'A random number of saves between 50 and 2000' },
                shares: { type: Type.INTEGER, description: 'A random number of shares between 5 and 250' },
            },
            required: ["likes", "comments", "saves", "shares"],
        },
    },
    required: ["id", "author", "type", "title", "summary", "content_md", "tags", "industries", "stage", "coverMedia", "stats"],
};

const getFallbackData = (): Post[] => {
  return [
    {
      id: 'fallback-1',
      author: { id: 'user1', username: 'fallback_dev', displayName: 'Fallback Developer', avatarUrl: 'https://i.pravatar.cc/150?u=fallback1', bio: 'Building resilient applications.', followerCount: 1337, followingCount: 42, postCount: 1, highlights: [{id: 'h1', title: 'Code', coverUrl: 'https://picsum.photos/200?random=1' }] },
      type: PostType.Problem,
      title: 'API Content Unavailable',
      summary: 'The dynamic content could not be loaded from the API. This is fallback data to ensure the application remains functional. The main cause is often a missing or invalid API key.',
      content_md: "This is a fallback post because the connection to the content generation API failed. This could be due to several reasons:\n\n*   **Invalid API Key**: The `API_KEY` environment variable is either missing or incorrect.\n*   **Network Issues**: There might be a problem connecting to the API services.\n*   **API Timeout**: The request to the service took too long to respond.\n\nTo resolve this, please check your API key and network connection. This fallback mechanism ensures that the application remains usable even when the primary content source is unavailable.",
      tags: ['error', 'fallback', 'resilience'],
      industries: ['Software Development'],
      stage: Stage.Launched,
      coverMedia: { type: 'image', url: 'https://picsum.photos/seed/1/1080/1350' },
      stats: { likes: 42, comments: 5, saves: 10, shares: 2 },
    },
    {
        id: 'fallback-2',
        author: { id: 'user2', username: 'annas_saas', displayName: 'Anna Thiel', avatarUrl: 'https://i.pravatar.cc/150?u=anna', bio: 'Founder @SaaSBuilder | Helping bootstrappers scale', followerCount: 24500, followingCount: 150, postCount: 34, highlights: [{id: 'h2', title: 'Growth', coverUrl: 'https://picsum.photos/200?random=2' }, {id: 'h3', title: 'My SaaS', coverUrl: 'https://picsum.photos/200?random=3' }] },
        type: PostType.Idea,
        title: 'AI-Powered Email Assistant for Busy Founders',
        summary: 'A tool that categorizes incoming emails by priority, drafts replies for common queries, and summarizes long threads to save hours each day.',
        content_md: "### The Problem\n\nFounders and entrepreneurs are constantly drowning in emails. Important conversations get lost, opportunities are missed, and countless hours are wasted on managing an overflowing inbox. Existing email clients are good, but they're not smart enough to understand a founder's unique priorities.\n\n### My Idea\n\nI'm thinking of building an AI-powered email assistant that integrates with your existing email (Gmail, Outlook). It would intelligently:\n\n*   **Prioritize**: Automatically categorizes emails into buckets like 'Urgent', 'Investor Updates', 'Customer Feedback', 'Team Questions'.\n*   **Draft Replies**: Uses AI to draft responses for common questions, which you can then edit and send in one click.\n*   **Summarize**: Provides TL;DR summaries for long email chains so you can get up to speed quickly.\n\nWhat do you think? Would this be a valuable tool for your workflow?",
        tags: ['ai', 'productivity', 'saas', 'startup'],
        industries: ['Software'],
        stage: Stage.Prototype,
        coverMedia: { type: 'video', url: 'https://videos.pexels.com/video-files/4434246/4434246-hd_720_1280_25fps.mp4', thumbnail: 'https://picsum.photos/seed/fb2/1080/1920' },
        is_reel: true,
        stats: { likes: 4200, comments: 153, saves: 890, shares: 72 },
    },
    {
        id: 'fallback-3',
        author: { id: 'user3', username: 'fintech_guru', displayName: 'Chris Romano', avatarUrl: 'https://i.pravatar.cc/150?u=chris', bio: 'Democratizing financial knowledge for all.', followerCount: 48000, followingCount: 89, postCount: 52, highlights: [{id: 'h4', title: 'Investing', coverUrl: 'https://picsum.photos/200?random=4' }, {id: 'h5', title: 'Fintech', coverUrl: 'https://picsum.photos/200?random=5' }, {id: 'h6', title: 'Live Events', coverUrl: 'https://picsum.photos/200?random=6' }] },
        type: PostType.Solution,
        title: '"FinWise": A Gamified Financial Literacy App for Gen Z',
        summary: 'We just launched an app that uses short-form video and interactive challenges to teach budgeting, investing, and credit scores. Early feedback is amazing!',
        content_md: "I'm thrilled to announce the launch of **FinWise**! \n\nWe saw a huge gap in the market: young people (Gen Z especially) find personal finance intimidating and boring. Traditional resources are dry, and they don't speak their language. \n\n### Our Solution\n\nFinWise tackles this head-on by making financial literacy fun and accessible. Here's how:\n\n*   **Gamified Learning**: We use points, badges, and leaderboards to make learning about complex topics like investing and credit scores feel like a game.\n*   **Bite-Sized Content**: All our lessons are delivered in a short-form, vertical video format, similar to TikTok or Reels.\n*   **Interactive Challenges**: Users can participate in weekly challenges to test their knowledge and build practical skills.\n\nThe response from our beta testers has been incredible, with users spending an average of 15 minutes per day on the app. We're officially live on the App Store and Google Play!",
        tags: ['fintech', 'mobile-app', 'education', 'gamification'],
        industries: ['FinTech', 'EdTech'],
        stage: Stage.Launched,
        coverMedia: { type: 'video', url: 'https://videos.pexels.com/video-files/4690333/4690333-hd_720_1280_25fps.mp4', thumbnail: 'https://picsum.photos/seed/fb3/1080/1920' },
        is_reel: true,
        stats: { likes: 8932, comments: 432, saves: 1500, shares: 210 },
    },
    {
        id: 'fallback-4',
        author: { id: 'user4', username: 'creator_code', displayName: 'Jenna', avatarUrl: 'https://i.pravatar.cc/150?u=jenna', bio: 'Building in public. Creator Economy tools.', followerCount: 12000, followingCount: 300, postCount: 78, highlights: [] },
        type: PostType.Showcase,
        title: 'Just shipped a new feature for my video editing SaaS!',
        summary: 'You can now automatically generate subtitles and captions for your videos in over 20 languages. This was a beast to build, but so worth it for accessibility.',
        content_md: "## Feature Drop: Auto-Captions are LIVE!\n\nThis is a huge one. After months of work, I'm so excited to announce that our video editing platform now supports automatic subtitle and caption generation. \n\n**Key features:**\n\n*   **High Accuracy**: Powered by the latest speech-to-text models.\n*   **Multi-Language Support**: Transcribe and translate into over 20 languages.\n*   **Customizable Styles**: Customize the look and feel of your captions to match your brand.\n\nThis is a game-changer for creators who want to make their content more accessible and engaging for a global audience. Go try it out and let me know what you think!",
        tags: ['saas', 'video-editing', 'accessibility', 'creator-economy'],
        industries: ['Creator Economy'],
        stage: Stage.Launched,
        coverMedia: { type: 'video', url: 'https://videos.pexels.com/video-files/8130177/8130177-hd_720_1280_25fps.mp4', thumbnail: 'https://picsum.photos/seed/fb4/1080/1920' },
        is_reel: true,
        stats: { likes: 5600, comments: 210, saves: 1100, shares: 95 },
    },
    {
        id: 'fallback-5',
        author: { id: 'user5', username: 'healthtech_hustler', displayName: 'David Chen', avatarUrl: 'https://i.pravatar.cc/150?u=david', bio: 'Improving patient outcomes with technology.', followerCount: 8500, followingCount: 210, postCount: 45, highlights: [] },
        type: PostType.Problem,
        title: 'Mental health support for startup founders is broken',
        summary: 'The immense pressure and isolation of building a company leads to burnout, but existing solutions are expensive and not tailored to the founder journey.',
        content_md: "Let's talk about a serious problem: founder mental health. We glorify the hustle, but we ignore the cost. The constant stress, the loneliness, the weight of responsibility—it's a recipe for burnout and depression. \n\nI've been there, and I know many of you have too. Trying to find a therapist who understands the unique pressures of startup life is incredibly difficult. Not to mention, it's expensive and time-consuming. We need a better solution, one that's accessible, affordable, and designed for entrepreneurs.",
        tags: ['mental-health', 'founder-wellbeing', 'healthtech', 'startup-life'],
        industries: ['HealthTech'],
        stage: Stage.Idea,
        coverMedia: { type: 'image', url: 'https://picsum.photos/seed/2/1080/1080' },
        stats: { likes: 7200, comments: 350, saves: 1800, shares: 150 },
    }
  ];
}

const injectVideos = (posts: Post[]): Post[] => {
    let videoIndex = 0;
    // For a small number of posts, we can use a simple pattern to inject videos.
    // e.g., make the 2nd and 4th posts videos.
    return posts.map((post, i) => {
        if ((i === 1 || i === 3) && post.coverMedia) {
            const thumbnailUrl = post.coverMedia.url;
            return {
                ...post,
                is_reel: true,
                coverMedia: {
                    type: 'video',
                    url: RELIABLE_VIDEO_URLS[videoIndex++ % RELIABLE_VIDEO_URLS.length],
                    thumbnail: thumbnailUrl,
                },
            };
        }
        return post;
    });
};

export const generateFeedContent = async (): Promise<Post[]> => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found. Returning fallback data.");
        return getFallbackData();
    }

    return new Promise(async (resolve) => {
        const timeoutId = setTimeout(() => {
            console.warn("API call timed out after 20 seconds. Returning fallback data.");
            resolve(getFallbackData());
        }, 20000);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                // The prompt is simplified to only ask for images, making it much faster.
                contents: `Generate a JSON array of 4 unique posts for the 'IdeaX' platform.
                
                RULES:
                1. All posts MUST have a 'coverMedia' of type 'image'.
                2. Use varied aspect ratios for images from picsum.photos (e.g., /1080/1350 for portrait, /1080/1080 for square, /1080/608 for landscape).
                3. Content should be diverse, covering industries like 'SaaS', 'FinTech', 'HealthTech', 'Creator Economy'.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: postSchema,
                    },
                },
            });
            
            clearTimeout(timeoutId);
            const jsonText = response.text.trim();
            let posts = JSON.parse(jsonText) as Post[];
            
            // Inject videos client-side for reliability
            posts = injectVideos(posts);

            resolve(posts);

        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Failed to generate feed content:", error);
            resolve(getFallbackData());
        }
    });
};
