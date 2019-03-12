require 'rails_helper'

RSpec.describe Api::PlacePollController, type: :controller do

  describe 'POST #create' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        event.participants << @user2
        add_authenticated_header(request, @user2)
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}
        @json = JSON.parse(response.body)
      end

      it 'should return code 200' do
        expect(response).to have_http_status(200)
      end

      it 'should create the place poll option' do
        expect(PlacePollOption.count).to eq(1)
      end

      it 'should return the place poll option' do
        expect(@json['place_poll_option']['id']).to be_truthy
      end

      it 'should add the user to the place poll option voters' do
        expect(@json['place_poll_option']['voters'][0]['id']).to eql(@user2.id)
      end

      it 'shouldn\'t show the voter\'s password digest' do
        expect(@json['place_poll_option']['voters'][0]['password_digest']).not_to be_truthy
      end
    end

    context 'valid params and closed to suggestions' do
      before do
        @user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: @user)
        event.is_open_to_places = false
        event.save

        event.participants << user2
        add_authenticated_header(request, @user)
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}
        @json = JSON.parse(response.body)
      end

      it 'should return code 200' do
        expect(response).to have_http_status(200)
      end

      it 'should create the place poll option' do
        expect(PlacePollOption.count).to eq(1)
      end

      it 'should return the place poll option' do
        expect(@json['place_poll_option']['id']).to be_truthy
      end

      it 'should add the user to the place poll option voters' do
        expect(@json['place_poll_option']['voters'][0]['id']).to eql(@user.id)
      end

      it 'shouldn\'t show the voter\'s password digest' do
        expect(@json['place_poll_option']['voters'][0]['password_digest']).not_to be_truthy
      end
    end

    context 'wrong params' do
      it 'should return 404 when the event does not exist' do
        user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: user)
        event.is_open_to_places = false
        event.save

        event.participants << user2
        add_authenticated_header(request, user)
        post :create, params: {hash: 'wrong',
                               place_poll_option: attributes_for(:place_poll_option, event: event)}

        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 401 because the user is not logged in' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        event.participants << user2
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot access the event' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user2)
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot suggest places' do
        user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: user)
        event.is_open_to_places = false
        event.save

        event.participants << user2
        add_authenticated_header(request, user2)
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the event does not have a place poll' do
        user = create(:user)
        event = build(:event, creator: user)
        event.has_place_poll = false
        event.save

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash,
                               place_poll_option: attributes_for(:place_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'POST #toggle' do
    context 'valid request' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)
        @event.participants << @user2

        @place_poll_option = create(:place_poll_option, event: @event)
        @place_poll_option.voters << user

        add_authenticated_header(request, @user2)
      end

      it 'should add the user\'s vote' do
        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id}

        expect(response).to have_http_status(200)
        expect(@place_poll_option.voters.length).to eql(2)
        expect(@place_poll_option.voters[1].id).to eql(@user2.id)
      end

      it 'should remove the user\'s vote' do
        @place_poll_option.voters << @user2
        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id}

        @place_poll_option.reload
        expect(response).to have_http_status(200)
        expect(@place_poll_option.voters.length).to eql(1)
        expect(@place_poll_option.voters[0].id).not_to eql(@user2.id)
      end
    end

    context 'bad request' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)
        @event.participants << @user2

        @place_poll_option = create(:place_poll_option, event: @event)
        @place_poll_option.voters << user

        add_authenticated_header(request, @user2)
      end

      it 'should return 404 when the event does not exist' do
        post :toggle, params: {hash: 'wrong', id: @place_poll_option.id}
        expect(response).to have_http_status(404)
      end

      it 'should return 404 when the place poll option does not exist' do
        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id + 1}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)

        @place_poll_option = create(:place_poll_option, event: @event)
        @place_poll_option.voters << user
      end

      it 'should return 401 because the user is not logged in' do
        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id}
        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot access the event' do
        add_authenticated_header(request, @user2)

        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id}
        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the event does not have a place poll' do
        @event.participants << @user2
        @event.has_place_poll = false
        @event.save
        add_authenticated_header(request, @user2)

        post :toggle, params: {hash: @event.event_hash, id: @place_poll_option.id}
        expect(response).to have_http_status(401)
      end
    end
  end

end
