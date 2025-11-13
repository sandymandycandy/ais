import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StudyCircle, Post, Comment } from '../models/StudyCircle';

export const createStudyCircle = async (req: AuthRequest, res: Response) => {
  try {
    const circleData = { ...req.body, creator: req.user._id, admins: [req.user._id] };
    const circle = await StudyCircle.create(circleData);
    res.status(201).json({ success: true, circle });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyCircles = async (req: Request, res: Response) => {
  try {
    const circles = await StudyCircle.find({ status: 'active', circleType: 'public' })
      .populate('creator', 'name profilePicture');
    res.json({ success: true, circles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyCircleById = async (req: Request, res: Response) => {
  try {
    const circle = await StudyCircle.findById(req.params.id)
      .populate('creator', 'name profilePicture')
      .populate('members.user', 'name profilePicture');
    if (!circle) return res.status(404).json({ message: 'Study circle not found' });
    res.json({ success: true, circle });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const joinCircle = async (req: AuthRequest, res: Response) => {
  try {
    const circle = await StudyCircle.findById(req.params.id);
    if (!circle) return res.status(404).json({ message: 'Circle not found' });

    circle.members.push({ user: req.user._id as any, joinedDate: new Date(), role: 'member', reputation: 0 });
    circle.totalMembers += 1;
    await circle.save();

    res.json({ success: true, message: 'Joined circle successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveCircle = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Left circle' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const postData = { ...req.body, studyCircle: req.params.id, author: req.user._id };
    const post = await Post.create(postData);
    await StudyCircle.findByIdAndUpdate(req.params.id, { $inc: { totalPosts: 1 } });
    res.status(201).json({ success: true, post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ studyCircle: req.params.id, status: 'active' })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentData = { ...req.body, post: req.params.postId, author: req.user._id };
    const comment = await Comment.create(commentData);
    res.status(201).json({ success: true, comment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const votePost = async (req: AuthRequest, res: Response) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (voteType === 'upvote') {
      if (!post.upvotes.includes(req.user._id as any)) {
        post.upvotes.push(req.user._id as any);
      }
    }
    await post.save();

    res.json({ success: true, post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, { status: 'deleted' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const pinPost = async (req: AuthRequest, res: Response) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, { pinned: true });
    res.json({ success: true, message: 'Post pinned' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
