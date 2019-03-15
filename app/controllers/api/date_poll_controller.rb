class Api::DatePollController < ApplicationController
  before_action :authenticate_user
  before_action :set_event, only: [:create, :toggle]
  before_action :set_date_poll_option, only: [:toggle]

  def create
    if @event === nil
      render status: 404
    else
      if user_can_access_date_poll
        date_poll_option_params = params.require(:date_poll_option).permit(:date)

        date_poll_option = DatePollOption.new(date_poll_option_params)
        date_poll_option.event = @event
        if date_poll_option.save
          date_poll_option.voters << current_user
          render json: {date_poll_option: date_poll_option}, include: get_includes
        else
          render status: 422, json: date_poll_option.errors.messages
        end
      else
        render status: 401
      end
    end
  end

  def toggle
    if @event === nil || @date_poll_option === nil || @date_poll_option.event_id != @event.id
      render status: 404
    else
      if user_can_access_date_poll
        if @date_poll_option.voters.any? { |user| user.id === current_user.id }
          @date_poll_option.voters.delete(current_user)
        else
          @date_poll_option.voters << current_user
        end

        render json: {success: true}
      else
        render status: 401
      end
    end
  end

  private

  def user_can_access_date_poll
    @event.has_date_poll &&
        @event.participants.any? {|user| user.id === current_user.id} &&
        (@event.is_open_to_dates || @event.user_is_admin(current_user))
  end

  def get_event_includes
    [
        :participants,
        :date_poll_options,
        :creator,
    ]
  end

  def get_includes
    [
        {voters: {except: [:password_digest]}}
    ]
  end

  def set_event
    @event = Event.includes(get_event_includes).find_by(event_hash: params[:hash])
  end

  def set_date_poll_option
    @date_poll_option = DatePollOption.includes(:voters).find(params[:id])
  end

end
