class Api::PlacePollController < ApplicationController
  before_action :authenticate_user
  before_action :set_event, only: [:create, :toggle]
  before_action :set_place_poll_option, only: [:toggle]

  def create
    if @event === nil
      render status: 404
    else
      if user_can_access_place_poll
        place_poll_option_params = params.require(:place_poll_option).permit(
            :name,
            :latitude,
            :longitude,
        )

        place_poll_option = PlacePollOption.new(place_poll_option_params)
        place_poll_option.event = @event
        if place_poll_option.save
          place_poll_option.voters << current_user
          render json: {place_poll_option: place_poll_option}, include: get_includes
        else
          render status: 422, json: place_poll_option.errors.messages
        end
      else
        render status: 401
      end
    end
  end

  def toggle
    if @event === nil || @place_poll_option === nil || @place_poll_option.event_id != @event.id
      render status: 404
    else
      if user_can_access_place_poll
        if @place_poll_option.voters.any? { |user| user.id === current_user.id }
          @place_poll_option.voters.delete(current_user)
        else
          @place_poll_option.voters << current_user
        end

        render json: {success: true}
      else
        render status: 401
      end
    end
  end

  private

  def user_can_access_place_poll
    @event.has_place_poll &&
        @event.participants.any? {|user| user.id === current_user.id} &&
        (@event.is_open_to_places || current_user.id === @event.creator.id)
  end

  def get_event_includes
    [
        :participants,
        :place_poll_options,
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

  def set_place_poll_option
    @place_poll_option = PlacePollOption.includes(:voters).find(params[:id])
  end

end
