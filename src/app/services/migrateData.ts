import { supabase } from '../lib/supabaseClient.ts';
import {
  mockProjects,
  mockStudents,
  mockStudyMaterials,
  mockPortfolios,
} from '../data/mockData.ts';

export const migrateDataToSupabase = async () => {
  try {
    console.log('Starting data migration to Supabase...');

    // 1. Migrate Students
    console.log('Migrating students...');
    const { error: studentsError } = await supabase.from('students').upsert(
      mockStudents.map((student) => ({
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        email: student.email,
        role: student.role,
        status: student.status,
        mobile_number: student.mobileNumber,
        joined_at: student.joinedAt,
        last_active: student.lastActive,
        email_verified: student.emailVerified,
        bio: student.bio,
        github_id: student.githubId,
        portfolio_url: student.portfolioUrl,
        linkedin_url: student.linkedinUrl,
        website_url: student.websiteUrl,
        twitter_handle: student.twitterHandle,
        location: student.location,
        occupation: student.occupation,
      })),
      { onConflict: 'id' }
    );

    if (studentsError) {
      console.error('Error migrating students:', studentsError);
      throw studentsError;
    }
    console.log('✓ Students migrated successfully');

    // 2. Migrate Projects (without tasks)
    console.log('Migrating projects...');
    const { error: projectsError } = await supabase.from('projects').upsert(
      mockProjects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        ai_summary: project.aiSummary,
      })),
      { onConflict: 'id' }
    );

    if (projectsError) {
      console.error('Error migrating projects:', projectsError);
      throw projectsError;
    }
    console.log('✓ Projects migrated successfully');

    // 3. Migrate Project-Student relationships
    console.log('Migrating project-student relationships...');
    const projectStudents = mockProjects.flatMap((project) =>
      project.students.map((studentId) => ({
        project_id: project.id,
        student_id: studentId,
      }))
    );

    const { error: projectStudentsError } = await supabase
      .from('project_students')
      .upsert(projectStudents, { onConflict: 'project_id,student_id' });

    if (projectStudentsError) {
      console.error('Error migrating project-student relationships:', projectStudentsError);
      throw projectStudentsError;
    }
    console.log('✓ Project-student relationships migrated successfully');

    // 4. Migrate Tasks
    console.log('Migrating tasks...');
    const tasks = mockProjects.flatMap((project) =>
      project.tasks.map((task) => ({
        id: task.id,
        project_id: project.id,
        name: task.name,
        assigned_to: task.assignedTo,
        status: task.status,
        deadline: task.deadline,
      }))
    );

    const { error: tasksError } = await supabase
      .from('tasks')
      .upsert(tasks, { onConflict: 'id' });

    if (tasksError) {
      console.error('Error migrating tasks:', tasksError);
      throw tasksError;
    }
    console.log('✓ Tasks migrated successfully');

    // 5. Migrate Comments
    console.log('Migrating comments...');
    const comments = mockProjects.flatMap((project) =>
      project.tasks.flatMap((task) =>
        task.comments.map((comment) => ({
          id: comment.id,
          task_id: task.id,
          text: comment.text,
          author: comment.author,
          timestamp: comment.timestamp,
        }))
      )
    );

    if (comments.length > 0) {
      const { error: commentsError } = await supabase
        .from('comments')
        .upsert(comments, { onConflict: 'id' });

      if (commentsError) {
        console.error('Error migrating comments:', commentsError);
        throw commentsError;
      }
    }
    console.log('✓ Comments migrated successfully');

    // 6. Migrate AI Alerts
    console.log('Migrating AI alerts...');
    const aiAlerts = mockProjects.flatMap((project) =>
      (project.aiAlerts || []).map((alert, index) => ({
        id: `alert-${project.id}-${index}`,
        project_id: project.id,
        alert_text: alert,
      }))
    );

    if (aiAlerts.length > 0) {
      const { error: alertsError } = await supabase
        .from('ai_alerts')
        .upsert(aiAlerts, { onConflict: 'id' });

      if (alertsError) {
        console.error('Error migrating AI alerts:', alertsError);
        throw alertsError;
      }
    }
    console.log('✓ AI alerts migrated successfully');

    // 7. Migrate Study Materials
    console.log('Migrating study materials...');
    const { error: materialsError } = await supabase.from('study_materials').upsert(
      mockStudyMaterials.map((material) => ({
        id: material.id,
        name: material.name,
        type: material.type,
        subject: material.subject,
        uploaded_by: material.uploadedBy,
        uploaded_at: material.uploadedAt,
        url: material.url,
        thumbnail: material.thumbnail,
        size: material.size,
        ai_summary: material.aiSummary,
        ai_key_points: material.aiKeyPoints,
      })),
      { onConflict: 'id' }
    );

    if (materialsError) {
      console.error('Error migrating study materials:', materialsError);
      throw materialsError;
    }
    console.log('✓ Study materials migrated successfully');

    // 8. Migrate Portfolios
    console.log('Migrating portfolios...');
    for (const [userId, portfolio] of Object.entries(mockPortfolios)) {
      // Migrate Skills
      if (portfolio.skills && portfolio.skills.length > 0) {
        const { error: skillsError } = await supabase.from('portfolio_skills').upsert(
          portfolio.skills.map((skill) => ({
            id: skill.id,
            user_id: userId,
            name: skill.name,
            category: skill.category,
            level: skill.level,
            learned_at: skill.learnedAt,
          })),
          { onConflict: 'id' }
        );

        if (skillsError) {
          console.error(`Error migrating skills for user ${userId}:`, skillsError);
        }
      }

      // Migrate Portfolio Projects
      if (portfolio.projects && portfolio.projects.length > 0) {
        const { error: projectsError } = await supabase
          .from('portfolio_projects')
          .upsert(
            portfolio.projects.map((project) => ({
              id: project.id,
              user_id: userId,
              name: project.name,
              description: project.description,
              technologies: project.technologies,
              link: project.link,
              completed_at: project.completedAt,
            })),
            { onConflict: 'id' }
          );

        if (projectsError) {
          console.error(
            `Error migrating portfolio projects for user ${userId}:`,
            projectsError
          );
        }
      }

      // Migrate Timeline
      if (portfolio.timeline && portfolio.timeline.length > 0) {
        const { error: timelineError } = await supabase
          .from('portfolio_timeline')
          .upsert(
            portfolio.timeline.map((entry) => ({
              id: entry.id,
              user_id: userId,
              date: entry.date,
              title: entry.title,
              description: entry.description,
              type: entry.type,
            })),
            { onConflict: 'id' }
          );

        if (timelineError) {
          console.error(`Error migrating timeline for user ${userId}:`, timelineError);
        }
      }

      // Migrate Achievements
      if (portfolio.achievements && portfolio.achievements.length > 0) {
        const { error: achievementsError } = await supabase
          .from('portfolio_achievements')
          .upsert(
            portfolio.achievements.map((achievement) => ({
              id: achievement.id,
              user_id: userId,
              title: achievement.title,
              description: achievement.description,
              awarded_by: achievement.awardedBy,
              awarded_at: achievement.awardedAt,
              certificate_url: achievement.certificateUrl,
            })),
            { onConflict: 'id' }
          );

        if (achievementsError) {
          console.error(
            `Error migrating achievements for user ${userId}:`,
            achievementsError
          );
        }
      }

      // Migrate Admin Feedback
      if (portfolio.adminFeedback && portfolio.adminFeedback.length > 0) {
        const { error: feedbackError } = await supabase.from('admin_feedback').upsert(
          portfolio.adminFeedback.map((feedback) => ({
            id: feedback.id,
            user_id: userId,
            text: feedback.text,
            admin_id: feedback.adminId,
            created_at: feedback.createdAt,
          })),
          { onConflict: 'id' }
        );

        if (feedbackError) {
          console.error(
            `Error migrating admin feedback for user ${userId}:`,
            feedbackError
          );
        }
      }

      // Migrate Portfolio Settings
      const { error: settingsError } = await supabase.from('portfolio_settings').upsert(
        [
          {
            user_id: userId,
            work_samples_github: portfolio.workSamples?.github,
            work_samples_portfolio: portfolio.workSamples?.portfolio,
            work_samples_demo: portfolio.workSamples?.demo,
            ai_skill_gap_analysis: portfolio.aiSkillGapAnalysis,
            ai_recommendations: portfolio.aiRecommendations,
            ai_summary: portfolio.aiSummary,
          },
        ],
        { onConflict: 'user_id' }
      );

      if (settingsError) {
        console.error(`Error migrating settings for user ${userId}:`, settingsError);
      }
    }
    console.log('✓ Portfolios migrated successfully');

    console.log('✅ Data migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Data migration failed:', error);
    return { success: false, error };
  }
};
