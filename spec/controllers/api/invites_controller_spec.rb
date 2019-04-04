require 'rails_helper'

RSpec.describe Api::InvitesController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: @user2.id}

        @json = JSON.parse(response.body)
      end

      it 'should create the invite' do
        expect(response).to have_http_status(200)
        expect(Invite.count).to eql(1)
      end

      it 'should return the invite' do
        expect(@json['invite']['id']).to be_truthy
      end

      it 'should include the invited user' do
        expect(@json['invite']['user']).to be_truthy
        expect(@json['invite']['user']['id']).to eql(@user2.id)
      end

      it 'should not include the user\'s password' do
        expect(@json['invite']['user']['password_digest']).not_to be_truthy
      end
    end

    context 'user already in event' do
      it 'should refuse to create because invite already exists' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)
        invite = create(:invite, user: user2, event: event)

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: user2.id}

        expect(response).to have_http_status(400)
        expect(Invite.count).to eql(1)
      end

      it 'should refuse to create because the user is already in the event' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)
        event.participants << user2

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: user2.id}

        expect(response).to have_http_status(400)
        expect(Invite.count).to eql(0)
      end
    end

    context 'invalid params' do
      it 'should return 404 when the event does not exist' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: 'wrong', user_id: @user2.id}

        expect(response).to have_http_status(404)
      end


      it 'should return 404 when the user not exist' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: @user2.id + 1}

        expect(response).to have_http_status(404)
      end
    end

    context 'not in event' do
      it 'should refuse access if the user is not in the event' do
        user = create(:user)
        @user2 = create(:user)
        user3 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user3)
        post :create, params: {hash: event.event_hash, user_id: @user2.id}        

        expect(response).to have_http_status(401)
      end
    end

    context 'unauthorized' do
      it 'should refuse access if the user is not logged in' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)
        
        post :create, params: {hash: event.event_hash, user_id: @user2.id}        

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET #index' do
    context 'valid request' do
      before do
        user = create(:user)
        user2 = create(:user)
        user3 = create(:user)
        event = create(:event, creator: user)
        event2 = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)
        invite2 = create(:invite, user: user2, event: event2)
        invite3 = create(:invite, user: user3, event: event)

        add_authenticated_header(request, user2)

        get :index

        @json = JSON.parse(response.body)
      end

      it 'should return the two invites' do
        expect(response).to have_http_status(200)
        expect(@json['invites'].length).to eql(2)
      end

      it 'should return the invite\'s event' do
        expect(@json['invites'][0]['event']['id']).to be_truthy
      end

      it 'shouldn\'t return the user' do
        expect(@json['invites'][0]['user']).not_to be_truthy
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)
        event2 = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)
        invite2 = create(:invite, user: user2, event: event)

        get :index

        expect(response).to have_http_status(401)
      end
    end
  end
  
  describe 'POST #accept' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)

        @invite = create(:invite, user: @user2, event: @event)

        add_authenticated_header(request, @user2)

        post :accept, params: {id: @invite.id}

        @json = JSON.parse(response.body)
      end

      it 'should return 200' do
        expect(response).to have_http_status(200)
      end

      it 'should add the user to the event' do
        @event.reload
        user_in_event = @event.participants.any? {|user| user.id === @user2.id }

        expect(user_in_event).to eql(true)
      end

      it 'should delete the invite' do
        expect(Invite.exists?(@invite)).to eql(false)
      end
    end

    context 'invalid params' do
      it 'should return 404 when the invite does not exist' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        add_authenticated_header(request, user2)

        post :accept, params: {id: invite.id + 1}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 404 when the user cannot access this invite' do
        user = create(:user)
        user2 = create(:user)
        user3 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        add_authenticated_header(request, user3)

        post :accept, params: {id: invite.id}
        expect(response).to have_http_status(404)
      end

      it 'should return 401 when the user is not logged in' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        post :accept, params: {id: invite.id}
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'POST #refuse' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)

        @invite = create(:invite, user: @user2, event: @event)

        add_authenticated_header(request, @user2)

        post :refuse, params: {id: @invite.id}

        @json = JSON.parse(response.body)
      end

      it 'should return 200' do
        expect(response).to have_http_status(200)
      end

      it 'should not add the user to the event' do
        @event.reload
        user_in_event = @event.participants.any? {|user| user.id === @user2.id }

        expect(user_in_event).to eql(false)
      end

      it 'should delete the invite' do
        expect(Invite.exists?(@invite)).to eql(false)
      end
    end

    context 'invalid params' do
      it 'should return 404 when the invite does not exist' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        add_authenticated_header(request, user2)

        post :refuse, params: {id: invite.id + 1}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 404 when the user cannot access this invite' do
        user = create(:user)
        user2 = create(:user)
        user3 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        add_authenticated_header(request, user3)

        post :refuse, params: {id: invite.id}
        expect(response).to have_http_status(404)
      end

      it 'should return 401 when the user is not logged in' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        invite = create(:invite, user: user2, event: event)

        post :refuse, params: {id: invite.id}
        expect(response).to have_http_status(401)
      end
    end
  end
end
