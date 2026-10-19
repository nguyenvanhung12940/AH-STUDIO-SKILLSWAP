"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  // Server-side validation
  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Định dạng email không hợp lệ." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map common Supabase errors to Vietnamese
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email hoặc mật khẩu không chính xác." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Vui lòng xác nhận email trước khi đăng nhập." };
    }
    return { error: `Lỗi đăng nhập: ${error.message}` };
  }

  redirect(redirectTo);
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    return { error: `Lỗi kết nối ${provider}: ${error.message}` };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const university = formData.get("university") as string;

  // Server-side validation
  if (!email || !password || !fullName || !university) {
    return { error: "Vui lòng điền đầy đủ tất cả các trường thông tin." };
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Định dạng email không hợp lệ." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        university: university,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "Email này đã được đăng ký." };
    }
    return { error: `Lỗi đăng ký: ${error.message}` };
  }

  return { success: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này." };
  }

  const fullName = formData.get("fullName") as string;
  const university = formData.get("university") as string;
  const bio = formData.get("bio") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      university: university,
      bio: bio,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Hồ sơ đã được cập nhật thành công!" };
}

export async function addSkill(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "teaching" | "learning";

  const { error } = await supabase
    .from("user_skills")
    .insert({
      profile_id: user.id,
      title,
      category_id: categoryId || null,
      description,
      type,
      status: "active",
    });

  if (error) return { error: error.message };
  return { success: "Đã thêm kỹ năng mới!" };
}

export async function deleteSkill(skillId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const { error } = await supabase
    .from("user_skills")
    .delete()
    .eq("id", skillId)
    .eq("profile_id", user.id); // Security: ensure ownership

  if (error) return { error: error.message };
  return { success: "Đã xóa kỹ năng." };
}

export async function createExchangeRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const receiverId = formData.get("receiverId") as string;
  const learningSkillId = formData.get("learningSkillId") as string; // Skill sender wants to learn from receiver
  const teachingSkillId = formData.get("teachingSkillId") as string; // Skill sender offers to teach receiver
  const message = formData.get("message") as string;

  if (user.id === receiverId) return { error: "Bạn không thể gửi yêu cầu cho chính mình." };

  // Check for existing pending request to avoid duplicates
  const { data: existing } = await supabase
    .from("exchange_requests")
    .select("id")
    .eq("sender_id", user.id)
    .eq("receiver_id", receiverId)
    .eq("status", "pending")
    .single();

  if (existing) return { error: "Bạn đã có một yêu cầu đang chờ xử lý với người dùng này." };

  const { data: request, error: insertError } = await supabase
    .from("exchange_requests")
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      learning_skill_id: learningSkillId || null,
      teaching_skill_id: teachingSkillId || null,
      message,
      status: "pending"
    })
    .select("*, sender:sender_id(full_name)")
    .single();

  if (insertError) return { error: insertError.message };

  // Create Notification for Receiver
  await supabase.from("notifications").insert({
    user_id: receiverId,
    type: "request_received",
    title: "Yêu cầu trao đổi mới",
    message: `${request.sender.full_name} muốn trao đổi kỹ năng với bạn.`,
    link: "/dashboard/requests"
  });

  return { success: "Yêu cầu trao đổi đã được gửi!" };
}

export async function updateRequestStatus(requestId: string, status: "accepted" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const { data: updatedReq, error } = await supabase
    .from("exchange_requests")
    .update({ status })
    .eq("id", requestId)
    .eq("receiver_id", user.id) // Only receiver can accept/reject
    .eq("status", "pending")
    .select("*, sender_id, receiver:receiver_id(full_name)")
    .single();

  if (error) return { error: error.message };

  // Create Notification for Sender
  await supabase.from("notifications").insert({
    user_id: updatedReq.sender_id,
    type: status === "accepted" ? "request_accepted" : "request_rejected",
    title: status === "accepted" ? "Yêu cầu được chấp nhận" : "Yêu cầu bị từ chối",
    message: `${updatedReq.receiver.full_name} đã ${status === "accepted" ? "chấp nhận" : "từ chối"} lời mời của bạn.`,
    link: "/dashboard/requests"
  });

  return { success: status === "accepted" ? "Đã chấp nhận yêu cầu!" : "Đã từ chối yêu cầu." };
}

export async function cancelRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const { data: request, error } = await supabase
    .from("exchange_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("sender_id", user.id) // Only sender can cancel
    .eq("status", "pending")
    .select("*, receiver:receiver_id(full_name), sender:sender_id(full_name)")
    .single();

  if (error) return { error: error.message };

  // Create Notification for Receiver
  await supabase.from("notifications").insert({
    user_id: request.receiver_id,
    type: "request_cancelled",
    title: "Yêu cầu đã bị hủy",
    message: `${request.sender.full_name} đã hủy yêu cầu trao đổi với bạn.`,
    link: "/dashboard/requests"
  });

  return { success: "Đã hủy yêu cầu." };
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const requestId = formData.get("requestId") as string;
  const startAt = formData.get("startAt") as string;
  const endAt = formData.get("endAt") as string;
  const location = formData.get("location") as string;
  const meetingLink = formData.get("meetingLink") as string;

  if (new Date(endAt) <= new Date(startAt)) {
    return { error: "Thời gian kết thúc phải sau thời gian bắt đầu." };
  }

  // Verify exchange request status
  const { data: request } = await supabase
    .from("exchange_requests")
    .select("status, sender_id, receiver_id")
    .eq("id", requestId)
    .single();

  if (!request || request.status !== 'accepted') {
    return { error: "Yêu cầu trao đổi phải được chấp nhận trước khi đặt lịch." };
  }

  if (user.id !== request.sender_id && user.id !== request.receiver_id) {
    return { error: "Bạn không có quyền đặt lịch cho yêu cầu này." };
  }

  // Conflict detection: Check for overlapping bookings for either user
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id, start_at, end_at, exchange_requests(sender_id, receiver_id)")
    .neq("status", "cancelled")
    .or(`start_at.lt.${endAt},end_at.gt.${startAt}`)
    .filter('start_at', 'lt', endAt)
    .filter('end_at', 'gt', startAt);

  // Manual filter for user participation in conflicts
  const userConflict = conflicts?.some(b => {
    const req = b.exchange_requests as any;
    return req.sender_id === user.id || req.receiver_id === user.id || 
           req.sender_id === request.sender_id || req.receiver_id === request.sender_id ||
           req.sender_id === request.receiver_id || req.receiver_id === request.receiver_id;
  });

  if (userConflict) {
    return { error: "Lịch học này trùng với một lịch học khác của bạn hoặc đối tác." };
  }

  const { error } = await supabase
    .from("bookings")
    .insert({
      request_id: requestId,
      start_at: startAt,
      end_at: endAt,
      location,
      meeting_link: meetingLink,
      status: "upcoming"
    });

  if (error) return { error: error.message };
  return { success: "Đã đặt lịch học thành công!" };
}

export async function updateBookingStatus(bookingId: string, status: "completed" | "cancelled") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const { error } = await supabase
    .from("bookings")
    .update({ 
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq("id", bookingId)
    .filter('status', 'eq', 'upcoming'); // Prevent changing already handled bookings

  if (error) return { error: error.message };
  return { success: `Đã cập nhật trạng thái buổi học: ${status}` };
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const bookingId = formData.get("bookingId") as string;
  const revieweeId = formData.get("revieweeId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  // Check if booking is completed
  const { data: booking } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.status !== 'completed') {
    return { error: "Bạn chỉ có thể đánh giá sau khi buổi học đã hoàn thành." };
  }

  // Check if already reviewed
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("reviewer_id", user.id)
    .single();

  if (existing) return { error: "Bạn đã đánh giá buổi học này rồi." };

  const { error } = await supabase
    .from("reviews")
    .insert({
      booking_id: bookingId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      comment
    });

  if (error) return { error: error.message };
  return { success: "Cảm ơn bạn đã gửi đánh giá!" };
}

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === 'admin';
}

export async function updateReportStatus(reportId: string, status: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId);

  if (error) return { error: error.message };
  return { success: "Đã cập nhật trạng thái báo cáo." };
}

export async function createReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập." };

  const reportedId = formData.get("reportedId") as string;
  const reason = formData.get("reason") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_id: reportedId,
      reason,
      description
    });

  if (error) return { error: error.message };
  return { success: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sớm nhất có thể." };
}
