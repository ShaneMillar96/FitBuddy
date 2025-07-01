using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Sessions;

namespace FitBuddy.Services.Profiles;

public class WorkoutSessionProfile : Profile
{
    public WorkoutSessionProfile()
    {
        // Entity to DTO mappings
        CreateMap<WorkoutSession, WorkoutSessionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (SessionStatusDto)src.Status));

        CreateMap<SessionExerciseProgress, SessionExerciseProgressDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (ExerciseStatusDto)src.Status))
            .ForMember(dest => dest.ExerciseName, opt => opt.MapFrom(src => src.Exercise.Name));

        CreateMap<SessionSetProgress, SessionSetProgressDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (SetStatusDto)src.Status));

        // DTO to Entity mappings
        CreateMap<CreateWorkoutSessionDto, WorkoutSession>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => SessionStatus.NotStarted))
            .ForMember(dest => dest.MemberId, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));

        CreateMap<CreateSessionExerciseProgressDto, SessionExerciseProgress>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ExerciseStatus.NotStarted))
            .ForMember(dest => dest.Sets, opt => opt.Ignore()); // Created in service

        // Update mappings
        CreateMap<UpdateSessionExerciseProgressDto, SessionExerciseProgress>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (ExerciseStatus)src.Status))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<UpdateSessionSetProgressDto, SessionSetProgress>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (SetStatusDto)src.Status))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // Enum mappings
        CreateMap<SessionStatus, SessionStatusDto>();
        CreateMap<SessionStatusDto, SessionStatus>();
        CreateMap<ExerciseStatus, ExerciseStatusDto>();
        CreateMap<ExerciseStatusDto, ExerciseStatus>();
        CreateMap<SetStatus, SetStatusDto>();
        CreateMap<SetStatusDto, SetStatus>();
    }
}